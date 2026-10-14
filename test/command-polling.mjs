import tap from 'tap'
import vm from 'node:vm'
import fs from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const repo = fileURLToPath(new URL('..', import.meta.url))
const apiSource = await fs.readFile(path.join(repo,
    'www/assets/js/api.js'), 'utf8')

function createApi(statuses) {
    let nextInterval = 0
    let nextTimeout = 0
    const intervals = new Map()
    const timeouts = new Map()
    const requests = []
    const context = vm.createContext({
        console,
        URL,
        JSONTag: { stringify: JSON.stringify },
        fetch: async url => {
            requests.push(url)
            const status = statuses.shift()
            if (status instanceof Error) {
                throw status
            }
            return {
                ok: true,
                json: async () => ({ status })
            }
        },
        setInterval(callback, milliseconds) {
            const id = ++nextInterval
            intervals.set(id, { callback, milliseconds })
            return id
        },
        clearInterval(id) {
            intervals.delete(id)
        },
        setTimeout(callback, milliseconds) {
            const id = ++nextTimeout
            timeouts.set(id, { callback, milliseconds })
            return id
        },
        clearTimeout(id) {
            timeouts.delete(id)
        },
        window: null
    })
    context.window = context
    context.apiURL = 'http://store.test'
    context.location = { search: '' }
    vm.runInContext(apiSource, context)

    return {
        api: context.slo.api,
        requests,
        intervals,
        timeouts,
        expire() {
            const timer = timeouts.values().next().value
            if (!timer) {
                throw new Error('No active command deadline')
            }
            timer.callback()
        },
        async tick() {
            const timer = intervals.values().next().value
            if (!timer) {
                throw new Error('No active polling interval')
            }
            timer.callback()
            await delay(0)
        }
    }
}

tap.test('command polling waits through accepted and active states', async t => {
    const fixture = createApi(['accepted', 'active', 'done'])
    const result = fixture.api.pollCommand('command-one')

    t.equal(fixture.intervals.size, 1)
    t.equal(fixture.intervals.values().next().value.milliseconds, 2000)
    t.equal(fixture.timeouts.values().next().value.milliseconds, 30000)
    await fixture.tick()
    t.equal(fixture.intervals.size, 1, 'accepted keeps polling')
    await fixture.tick()
    t.equal(fixture.intervals.size, 1, 'active keeps polling')
    await fixture.tick()

    t.same(await result, { status: 'done' })
    t.equal(fixture.intervals.size, 0, 'terminal state stops polling')
    t.equal(fixture.timeouts.size, 0, 'terminal state clears the deadline')
    t.same(fixture.requests, [
        'http://store.test/command/command-one',
        'http://store.test/command/command-one',
        'http://store.test/command/command-one'
    ])
})

tap.test('command polling has a real deadline and clears failures', async t => {
    const timeout = createApi([])
    const timedResult = timeout.api.pollCommand('slow-command')
    const timedRejection = t.rejects(timedResult, { code: 408,
        message: 'Command takes too long' })
    timeout.expire()
    await timedRejection
    t.equal(timeout.intervals.size, 0, 'timeout stops polling')
    t.equal(timeout.timeouts.size, 0, 'expired deadline is cleared')

    const failed = createApi([new Error('status unavailable')])
    const failedResult = failed.api.pollCommand('failed-request')
    const failedRejection = t.rejects(failedResult,
        { message: 'status unavailable' })
    await failed.tick()
    await failedRejection
    t.equal(failed.intervals.size, 0, 'request failure stops polling')
    t.equal(failed.timeouts.size, 0, 'request failure clears the deadline')
})
