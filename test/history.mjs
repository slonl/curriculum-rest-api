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
import query from '../src/object-history-query.js'

const repo = fileURLToPath(new URL('..', import.meta.url))

function historicalObject(title) {
    const child = { id: 'child', title: 'Shared child' }
    JSONTag.setAttribute(child, 'class', 'Child')
    const object = { id: 'root', title, Child: [child], featured: child }
    JSONTag.setAttribute(object, 'class', 'Root')
    return object
}

const history = [
    { version: 0, timestamp: '2026-10-14T08:00:00.000Z', command: null,
        object: historicalObject('Original') },
    { version: 1, timestamp: '2026-10-14T09:00:00.000Z', command: {
        id: 'change-root', name: 'patch', author: 'Editor',
        message: 'Update title', version: 1,
        timestamp: '2026-10-14T09:00:00.000Z'
    }, object: historicalObject('Current') }
]

function runQuery(id) {
    const object = id === 'root' ? history[1].object : undefined
    const meta = {
        index: { id: { get: value => value === '/uuid/root' ? object : undefined } },
        history: { get: value => value === object ? history : undefined }
    }
    const execute = vm.runInThisContext('(function(meta, request) {' +
        'return eval(' + JSON.stringify(query) + ') })')
    return execute(meta, { query: { id } })
}

tap.test('object history query starts from the current indexed object', t => {
    const result = runQuery('root')
    t.equal(result.length, 2)
    t.same(result.map(entry => Object.keys(entry)), [
        ['version', 'timestamp', 'command', 'object'],
        ['version', 'timestamp', 'command', 'object']
    ], 'the projection contains only the public history contract')
    t.equal(result[0].object.title, 'Original')
    t.equal(result[1].command.author, 'Editor')
    t.equal(runQuery('missing'), null, 'an unknown current ID returns null')
    t.end()
})

tap.test('history endpoint inherits reader auth and preserves JSONTag', async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'history-api-'))
    let calls = 0
    let fail = false
    const store = http.createServer(async (req, res) => {
        calls++
        const requestUrl = new URL(req.url, 'http://localhost')
        t.equal(requestUrl.pathname, '/query/', 'history uses the normal query')
        t.equal(req.method, 'POST')
        let source = ''
        for await (const chunk of req) { source += chunk }
        t.match(source, 'meta.history.get(object)')
        if (fail) {
            res.writeHead(503).end('unavailable')
            return
        }
        const result = runQuery(requestUrl.searchParams.get('id'))
        res.setHeader('Content-Type', 'application/jsontag')
        res.end(JSONTag.stringify(result))
    })
    store.listen(0, '127.0.0.1')
    await once(store, 'listening')
    const reserve = http.createServer()
    reserve.listen(0, '127.0.0.1')
    await once(reserve, 'listening')
    const port = reserve.address().port
    await new Promise(resolve => reserve.close(resolve))
    await fs.writeFile(path.join(directory, 'apiKeys.json'), JSON.stringify({
        reader: { key: 'test-reader' }
    }))
    await fs.writeFile(path.join(directory, 'editors.json'), '{}')
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
    const request = (id, authenticated = true) => fetch(
        `http://127.0.0.1:${port}/uuid/${id}/history`, {
            headers: {
                Accept: 'application/jsontag',
                ...(authenticated ? { Authorization: 'Basic ' +
                    Buffer.from('reader:test-reader').toString('base64') } : {})
            }
        })
    t.equal((await request('root', false)).status, 401,
        'anonymous access is rejected')
    t.equal(calls, 0, 'authentication failure does not reach the store')
    const response = await request('root')
    t.equal(response.status, 200)
    t.equal(response.headers.get('cache-control'), 'no-store')
    t.match(response.headers.get('content-type'), 'application/jsontag')
    const result = JSONTag.parse(await response.text())
    t.equal(result[0].object.title, 'Original')
    t.equal(JSONTag.getAttribute(result[0].object, 'class'), 'Root',
        'historical object type is preserved')
    t.equal(result[0].object.Child[0], result[0].object.featured,
        'historical links retain identity')
    t.equal(result[1].command.message, 'Update title')
    const missing = await request('missing')
    t.equal(missing.status, 404)
    t.equal(missing.headers.get('cache-control'), 'no-store')
    fail = true
    const failed = await request('root')
    t.equal(failed.status, 500)
    t.equal(failed.headers.get('cache-control'), 'no-store')
})

tap.test('local API requests the history resource as JSONTag', async t => {
    const calls = []
    const context = vm.createContext({ console, JSONTag, jsontagMeta: {},
        changes: {}, browser: {}, window: null, slo: { api: {
            get: async (...args) => { calls.push(args); return history }
        } } })
    context.window = context
    vm.runInContext(await fs.readFile(path.join(repo,
        'www/assets/js/local-api.js'), 'utf8'), context)
    t.equal((await context.localAPI.history('root / one')).length, 2)
    t.same(calls, [['uuid/root%20%2F%20one/history', null, true]])
})

tap.test('browser links and presents a bounded, stale-safe history view', async t => {
    const routes = []
    const bodyClasses = new Set()
    let historyResult = history
    const noop = () => {}
    const localAPI = {
        schemas: async () => ({ types: {} }),
        item: async () => ({ id: 'root', title: 'Current' }),
        history: async () => historyResult,
        reflect: { item: id => 'request ' + id }
    }
    const context = vm.createContext({
        console, URL, Symbol, JSONTag, jsontagMeta: {}, changes: {}, localAPI,
        MathJax: { Hub: { Queue: noop } },
        localStorage: { getItem: key => key === 'browser.view.preferedView' ?
            'item' : null },
        slo: { api: { loadSchemas: async () => ({ types: {} }) } },
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
    context.release = { apiPath: '/curriculum/2024/',
        apiURL: 'http://localhost' }
    context.addEventListener = noop
    vm.runInContext(await fs.readFile(path.join(repo,
        'www/assets/js/databrowser.js'), 'utf8'), context)
    await delay(0)
    const browser = context.browser
    t.ok(browser.routes['/uuid/:id/history/'])
    const matchedRoute = Object.keys(browser.routes).find(route =>
        new RegExp('^' + route.replace(/:\w+/g, '([^/]+)')
            .replace(/:\*/, '(.*)')).test('/uuid/root/history/'))
    t.equal(matchedRoute, '/uuid/:id/history/',
        'the specific history route precedes SimplyView prefix matches')
    await browser.actions.item('root')
    t.equal(browser.view.item.$historyHref,
        '/curriculum/2024/uuid/root/history/',
        'the current object links to its audit trail')
    const loaded = browser.actions.history('root')
    t.ok(bodyClasses.has('history-loading'), 'loading is visible')
    await loaded
    t.equal(browser.view.view, 'history')
    t.equal(browser.view.historyTitle, 'Current')
    t.equal(browser.view.historyBackHref, '/curriculum/2024/uuid/root')
    t.equal(browser.view.historyStatus, '2 versies gevonden.')
    t.equal(browser.view.historyEntries[0].versionLabel, 'Basisversie')
    t.equal(browser.view.historyEntries[0].author, 'Basisdataset')
    t.equal(browser.view.historyEntries[1].author, 'Editor')
    t.equal(browser.view.historyEntries[1].message, 'Update title')
    t.match(browser.view.historyEntries[1].snapshot, 'Current')
    t.notOk(bodyClasses.has('history-loading'), 'completion hides loading')
    let finish
    historyResult = new Promise(resolve => { finish = resolve })
    const pending = browser.actions.history('root')
    browser.actions.clearView()
    browser.view.view = 'item'
    finish(history)
    await pending
    t.equal(browser.view.view, 'item',
        'a stale history response cannot replace later navigation')
    historyResult = []
    await browser.actions.history('root')
    t.equal(browser.view.historyStatus, 'Geen geschiedenis gevonden.')
    localAPI.history = async () => { throw new Error('timeout') }
    await browser.actions.history('root')
    t.match(browser.view.historyStatus, 'mislukt')
    t.same(browser.view.historyEntries, [])
    t.notOk(bodyClasses.has('history-loading'), 'failure hides loading')
    const itemTemplate = await fs.readFile(path.join(repo,
        'www/templates/item.html'), 'utf8')
    const historyTemplate = await fs.readFile(path.join(repo,
        'www/templates/history.html'), 'utf8')
    t.match(itemTemplate, '>Geschiedenis</a>')
    t.match(historyTemplate, '<details>')
    t.match(historyTemplate, 'data-simply-field="snapshot"')
})
