import tap from 'tap'
import vm from 'node:vm'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { once } from 'node:events'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import JSONTag from '@muze-nl/jsontag'
import * as jaqt from '@muze-nl/jaqt'
import query from '../src/orphans-query.js'
import changes from '../www/assets/js/changes.mjs'

const repo = fileURLToPath(new URL('..', import.meta.url))
function entity(type, id, extra = {}) {
    const value = { id, title: id, ...extra }
    JSONTag.setAttribute(value, 'class', type)
    return value
}
const fixture = {
    meta: { schema: { types: {
        Root: { root: true }, Child: {}, Missing: {},
        KerndoelUitstroomprofiel: {}, Deprecated: {}
    } } },
    data: {
        Root: [entity('Root', 'root')],
        Child: [entity('Child', 'missing'), entity('Child', 'empty', { root: [] }),
            entity('Child', 'linked', { root: [{ id: 'root' }] }),
            entity('Child', 'deleted', { deleted: true }), null],
        KerndoelUitstroomprofiel: [entity('KerndoelUitstroomprofiel', 'profile')],
        Deprecated: [entity('Deprecated', 'deprecated')]
    }
}
function runQuery(source, params = {}) {
    // Keep JAQT callbacks in the same realm as JAQT's Function checks.
    const run = vm.runInThisContext('(function(data, meta, JSONTag, from, _, request) {' +
        'return eval(' + JSON.stringify(source) + ') })')
    return run(fixture.data, fixture.meta, JSONTag, jaqt.from, jaqt._, { query: params })
}
const expected = ['missing', 'empty'].map(id => ({ type: 'Child', id, title: id }))

tap.test('orphan query includes missing/empty roots and excludes ineligible data', t => {
    t.same(runQuery(query), expected)
    const original = fixture.data.Child
    fixture.data.Child = Array.from({ length: 1001 }, (_, index) =>
        entity('Child', 'child-' + index))
    const result = runQuery(query)
    t.equal(result.length, 1001, 'one query returns the complete selection')
    t.same(result.at(-1),
        { type: 'Child', id: 'child-1000', title: 'child-1000' })
    fixture.data.Child = original
    t.end()
})

tap.test('orphan deletion survives staging and has a visible preview', t => {
    globalThis.release = { apiPath: '/' }
    globalThis.JSONTag = JSONTag
    t.teardown(() => { delete globalThis.release; delete globalThis.JSONTag })
    const history = new changes.Changes()
    const change = { id: 'empty', type: 'deleteRoot', orphanOnly: true,
        meta: { context: 'curriculum', type: 'Child', title: 'Empty', timestamp: 'now' } }
    history.push(new changes.Change(change))
    const merged = history.merge()
    t.same(merged.commit(), [{ id: 'empty', name: 'deleteEntity',
        '@type': 'Child', orphanOnly: true }])
    t.match(merged.preview()[0].types[0].entities[0].diff, 'Als verwijderd markeren')
    history.push(new changes.Change({ ...change, type: 'undeleteRoot' }))
    t.same(history.merge().commit(), [{ id: 'empty', name: 'undeleteEntity',
        '@type': 'Child' }], 'undo retains the normal restoration command')
    const normal = new changes.Changes()
    normal.push(new changes.Change({ ...change, orphanOnly: false }))
    t.notOk(normal.merge().commit()[0].orphanOnly, 'ordinary deletion is unchanged')
    t.end()
})

tap.test('only editors can run the orphan query through slowquery', async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'orphans-api-'))
    let calls = 0
    let fail = false
    const store = http.createServer(async (req, res) => {
        calls++
        t.equal(new URL(req.url, 'http://localhost').pathname, '/slowquery/')
        t.equal(req.method, 'POST')
        let source = ''
        for await (const chunk of req) { source += chunk }
        if (fail) {
            res.writeHead(503).end('unavailable')
            return
        }
        res.setHeader('Content-Type', 'application/jsontag')
        res.end(JSONTag.stringify(runQuery(source, Object.fromEntries(
            new URL(req.url, 'http://localhost').searchParams))))
    })
    store.listen(0, '127.0.0.1')
    await once(store, 'listening')
    const reserve = http.createServer()
    reserve.listen(0, '127.0.0.1')
    await once(reserve, 'listening')
    const port = reserve.address().port
    await new Promise(resolve => reserve.close(resolve))
    await fs.writeFile(path.join(directory, 'apiKeys.json'), JSON.stringify({
        editor: { key: 'test-editor' }, reader: { key: 'test-reader' }
    }))
    await fs.writeFile(path.join(directory, 'editors.json'), '{"editor":true}')
    const server = spawn(process.execPath, [path.join(repo, 'src/api-server.js')], {
        cwd: directory, env: { ...process.env, NODE_PORT: String(port),
            NODE_SIMPLYSTORE_URL: `http://127.0.0.1:${store.address().port}` },
        stdio: ['ignore', 'pipe', 'pipe']
    })
    let output = ''
    server.stdout.on('data', bytes => { output += bytes })
    server.stderr.on('data', bytes => { output += bytes })
    t.teardown(async () => {
        if (server.exitCode === null && !server.signalCode) {
            const exited = once(server, 'exit')
            server.kill()
            await exited
        }
        store.closeAllConnections()
        await new Promise(resolve => store.close(resolve))
        await fs.rm(directory, { recursive: true, force: true })
    })
    for (let attempt = 0; !output.includes('API server listening'); attempt++) {
        if (attempt > 100 || server.exitCode !== null) { throw new Error(output) }
        await delay(25)
    }
    async function request(user) {
        const headers = { Accept: 'application/json' }
        if (user) {
            headers.Authorization = 'Basic ' +
                Buffer.from(`${user}:test-${user}`).toString('base64')
        }
        return fetch(`http://127.0.0.1:${port}/orphans/`, { headers })
    }
    t.equal((await request()).status, 401, 'anonymous access denied')
    t.equal((await request('reader')).status, 403, 'read access is insufficient')
    t.equal(calls, 0, 'denied requests never run the slow query')
    const result = await request('editor')
    t.equal(result.status, 200)
    t.equal(result.headers.get('cache-control'), 'no-store')
    t.same(await result.json(), expected)
    t.equal(calls, 1, 'the entire scan uses one slowquery request')
    fail = true
    t.equal((await request('editor')).status, 500, 'store errors are reported')
})

tap.test('orphan UI actions require login, ignore stale results and stage selection', async t => {
    const routes = []
    let requests = 0
    let result = expected
    const history = new changes.Changes()
    const staged = { Change: changes.Change, changes: history, merged: {},
        update() { this.merged = history.merge() } }
    const api = {
        loadSchemas: async () => ({ types: {} }),
        get: async () => { requests++; return result }
    }
    const noop = () => {}
    const bodyClasses = new Set()
    const context = vm.createContext({
        console, URL, Symbol, Set, JSONTag, jsontagMeta: {}, changes: staged,
        localStorage: { getItem: () => null },
        slo: { api, getContextByTypeName: () => 'curriculum' },
        document: { location: new URL('http://localhost/'), addEventListener: noop,
            body: { classList: {
                remove: name => bodyClasses.delete(name),
                add: name => bodyClasses.add(name)
            }, dataset: {} } },
        simply: { activate: { addListener: noop }, collect: { addListener: noop },
            route: { init: noop, goto: route => routes.push(route) },
            app(config) { return config } }
    })
    context.window = context
    context.release = { apiPath: '/', apiURL: 'http://localhost' }
    context.addEventListener = noop
    vm.runInContext(await fs.readFile(path.join(repo,
        'www/assets/js/databrowser.js'), 'utf8'), context)
    await delay(0)
    const browser = context.browser
    t.ok(browser.routes['/orphans/'])
    await browser.actions.orphans()
    t.equal(requests, 0, 'logged-out visit cannot start a query')
    t.same(routes, ['/login/'])
    browser.view.loggedIn = true
    const initialLoad = browser.actions.orphans()
    t.ok(bodyClasses.has('orphans-loading'), 'initial load shows the loading circle')
    t.equal(browser.view.orphanButtonAttributes.disabled, '', 'initial load disables buttons')
    await initialLoad
    t.notOk(bodyClasses.has('orphans-loading'), 'initial completion hides the circle')
    t.equal(browser.view.orphanButtonAttributes.disabled, null, 'initial completion enables buttons')
    t.equal(requests, 1)
    t.equal(browser.view.orphans.length, 2)
    t.equal(browser.view.orphans[0].href, 'http://localhost/uuid/missing')
    t.equal(browser.view.orphans[0].displayTitle, 'missing')
    let commitDialogs = 0
    browser.commands.showCommitChanges = () => commitDialogs++
    browser.commands.deleteOrphans({ querySelectorAll: () => [{ value: 'empty' }] })
    t.equal(commitDialogs, 1, 'selection opens the save/commit dialog')
    t.same(staged.merged.commit(), [{ id: 'empty', name: 'deleteEntity',
        '@type': 'Child', orphanOnly: true }])
    t.equal(browser.view.orphans.length, 1)
    await browser.actions.orphans()
    t.equal(browser.view.orphans.length, 1, 'pending deletion stays hidden after refresh')
    let finish
    result = new Promise(resolve => { finish = resolve })
    const pending = browser.actions.orphans()
    t.equal(browser.view.orphanLoading, true, 'wait indicator is active')
    t.ok(bodyClasses.has('orphans-loading'), 'refresh shows the loading overlay')
    t.equal(browser.view.orphanButtonAttributes.disabled, '', 'refresh disables buttons')
    t.doesNotThrow(() => browser.commands.selectAllOrphans(null),
        'selection is ignored while loading')
    const activeRequests = requests
    await browser.commands.refreshOrphans()
    t.equal(requests, activeRequests, 'refresh cannot start a duplicate scan')
    browser.actions.clearView()
    t.equal(browser.view.orphanLoading, false, 'leaving clears the wait state')
    t.notOk(bodyClasses.has('orphans-loading'), 'navigation hides the overlay')
    browser.view.view = 'item'
    finish(expected)
    await pending
    t.equal(browser.view.view, 'item', 'slow response does not replace a later view')
    t.same(browser.view.orphans, [], 'stale response is ignored')
    result = []
    await browser.actions.orphans()
    t.equal(browser.view.orphanStatus, 'Geen wezen gevonden.')
    t.equal(browser.view.orphanLoading, false, 'success clears the wait state')
    t.notOk(bodyClasses.has('orphans-loading'), 'success hides the overlay')
    api.get = async () => { throw new Error('timeout') }
    await browser.actions.orphans()
    t.match(browser.view.orphanStatus, 'mislukt')
    t.equal(browser.view.orphanLoading, false, 'failure clears the wait state')
    t.notOk(bodyClasses.has('orphans-loading'), 'failure hides the overlay')
    t.equal(browser.view.orphanButtonAttributes.disabled, null, 'failure enables retry')
    t.same(browser.view.orphans, [])
})
