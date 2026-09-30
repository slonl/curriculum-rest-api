import tap from 'tap'
import {IndexedDBStorage} from '../www/assets/js/storage.mjs'

/**
 * A fake IndexedDB that is just real enough to drive IndexedDBStorage: it
 * keeps records in a Map and completes transactions asynchronously, the way a
 * real one does.
 */
function fakeIndexedDB(seed = {}) {
    const records = new Map(Object.entries(seed))

    function transaction() {
        const tx = {}
        tx.objectStore = () => ({
            getAllKeys: () => ({result: [...records.keys()]}),
            getAll: () => ({result: [...records.values()]}),
            put: (value, key) => records.set(key, value),
            delete: (key) => records.delete(key)
        })
        setTimeout(() => tx.oncomplete && tx.oncomplete(), 0)
        return tx
    }

    const db = {
        objectStoreNames: {contains: () => true},
        createObjectStore: () => records,
        close: () => {},
        transaction
    }

    return {
        records,
        open() {
            const request = {}
            setTimeout(() => {
                request.result = db
                request.onsuccess && request.onsuccess()
            }, 0)
            return request
        }
    }
}

function withFakeIndexedDB(seed, run) {
    const fake = fakeIndexedDB(seed)
    const previous = globalThis.indexedDB
    globalThis.indexedDB = fake
    return Promise.resolve(run(fake)).finally(() => {
        globalThis.indexedDB = previous
    })
}

tap.test('preloads records so reads are synchronous once ready', async t => {
    await withFakeIndexedDB({changeHistory: 'a stored change log'}, async () => {
        const storage = new IndexedDBStorage()

        t.equal(storage.getItem('changeHistory'), null,
            'a read before ready reports nothing rather than blocking')

        await storage.ready
        t.ok(storage.available, 'the database is open')
        t.equal(storage.getItem('changeHistory'), 'a stored change log',
            'after ready the read is synchronous and returns the stored value')
        t.equal(storage.getItem('absent'), null)
    })
    t.end()
})

tap.test('a write is visible at once and persisted on flush', async t => {
    await withFakeIndexedDB({}, async (fake) => {
        const storage = new IndexedDBStorage()
        await storage.ready

        storage.setItem('changeHistory', 'a new change log')

        t.equal(storage.getItem('changeHistory'), 'a new change log',
            'the read reflects the write immediately')
        t.notOk(fake.records.has('changeHistory'), 'not yet persisted')

        await storage.flush()
        t.equal(fake.records.get('changeHistory'), 'a new change log',
            'persisted after flush')
    })
    t.end()
})

tap.test('a removal is visible at once and persisted on flush', async t => {
    await withFakeIndexedDB({changeHistory: 'to be removed'}, async (fake) => {
        const storage = new IndexedDBStorage()
        await storage.ready

        storage.removeItem('changeHistory')
        t.equal(storage.getItem('changeHistory'), null, 'gone from memory at once')

        await storage.flush()
        t.notOk(fake.records.has('changeHistory'), 'gone from IndexedDB after flush')
    })
    t.end()
})

tap.test('keys are independent', async t => {
    await withFakeIndexedDB({username: 'someone'}, async (fake) => {
        const storage = new IndexedDBStorage()
        await storage.ready

        storage.setItem('key', 'a secret')
        await storage.flush()

        t.equal(fake.records.get('username'), 'someone')
        t.equal(fake.records.get('key'), 'a secret')
    })
    t.end()
})

tap.test('unavailable IndexedDB fails loudly instead of falling back', async t => {
    const previous = globalThis.indexedDB
    delete globalThis.indexedDB
    try {
        const storage = new IndexedDBStorage()
        await t.rejects(storage.ready, /not available/i,
            'ready rejects rather than resolving to a fallback store')
        t.notOk(storage.available)
        t.throws(() => storage.setItem('changeHistory', 'anything'),
            /not open/i, 'writing before ready is refused, not silently dropped')
    } finally {
        globalThis.indexedDB = previous
    }
    t.end()
})
