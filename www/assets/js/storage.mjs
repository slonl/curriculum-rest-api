/**
 * Generic key/value storage for browser-side persistence.
 *
 * Callers reach storage through an instance of this class rather than through
 * the localStorage global, so the backing store can be changed without
 * rewriting every call site.
 *
 * The surface is the subset of the Storage interface this application
 * actually uses. Values are strings, as they are in localStorage.
 *
 * Behaviour when localStorage is unavailable is part of the contract: reads
 * report nothing, removals do nothing, and writes report unavailability. This
 * matches what the change log already did when it guarded the global directly,
 * so introducing this class does not alter observable behaviour.
 */
export class Storage {
    get available() {
        return !!globalThis.localStorage
    }

    getItem(key) {
        if (!globalThis.localStorage) {
            return null
        }
        return globalThis.localStorage.getItem(key)
    }

    setItem(key, value) {
        if (!globalThis.localStorage) {
            throw new Error('Cannot store changes, localStorage is unavailable')
        }
        globalThis.localStorage.setItem(key, value)
    }

    removeItem(key) {
        if (!globalThis.localStorage) {
            return
        }
        globalThis.localStorage.removeItem(key)
    }

    async flush() {
    }
}

const DEFAULT_DB_NAME = 'slo-curriculum-browser'
const DEFAULT_STORE_NAME = 'storage'

/**
 * Storage backed by IndexedDB, for values too large for localStorage.
 *
 * IndexedDB has no synchronous API, so this class preloads its records once at
 * start-up and serves reads from that in-memory copy. Once `ready` has
 * settled, getItem, setItem and removeItem are synchronous and no call site
 * needs to await. Writes update the copy immediately and are persisted in the
 * background, in the order they were made; call flush() before the page
 * navigates away or reloads.
 *
 * A read issued before `ready` settles reports nothing rather than blocking,
 * so the preload must be awaited during start-up before the application reads.
 *
 * If IndexedDB cannot be used, `ready` rejects. There is deliberately no
 * fallback to another store: failing loudly is preferable to silently
 * reverting to the quota this class exists to escape.
 */
export class IndexedDBStorage {
    #db = null
    #cache = new Map()
    #dbName
    #storeName
    #ready
    #pending = Promise.resolve()

    constructor(dbName = DEFAULT_DB_NAME, storeName = DEFAULT_STORE_NAME) {
        this.#dbName = dbName
        this.#storeName = storeName
        this.#ready = this.#open()
    }

    /**
     * Resolves once the database is open and the in-memory copy is populated.
     * Rejects if IndexedDB is unavailable or cannot be opened.
     */
    get ready() {
        return this.#ready
    }

    get available() {
        return this.#db !== null
    }

    #open() {
        return new Promise((resolve, reject) => {
            if (!globalThis.indexedDB) {
                reject(new Error('IndexedDB is not available in this browser'))
                return
            }
            let request
            try {
                request = globalThis.indexedDB.open(this.#dbName, 1)
            } catch (error) {
                reject(error)
                return
            }
            request.onupgradeneeded = () => {
                let db = request.result
                if (!db.objectStoreNames.contains(this.#storeName)) {
                    db.createObjectStore(this.#storeName)
                }
            }
            request.onerror = () => {
                reject(request.error ?? new Error('Could not open IndexedDB'))
            }
            request.onblocked = () => {
                reject(new Error('IndexedDB open was blocked by another connection'))
            }
            request.onsuccess = () => {
                this.#db = request.result
                this.#db.onversionchange = () => this.#db.close()
                this.#load().then(resolve, reject)
            }
        })
    }

    #load() {
        return new Promise((resolve, reject) => {
            let transaction = this.#db.transaction(this.#storeName, 'readonly')
            let store = transaction.objectStore(this.#storeName)
            let keys = store.getAllKeys()
            let values = store.getAll()
            transaction.oncomplete = () => {
                keys.result.forEach((key, index) => {
                    this.#cache.set(key, values.result[index])
                })
                resolve()
            }
            transaction.onerror = () => reject(transaction.error)
            transaction.onabort = () => reject(transaction.error)
        })
    }

    getItem(key) {
        if (!this.#cache.has(key)) {
            return null
        }
        return this.#cache.get(key)
    }

    setItem(key, value) {
        this.#assertOpen()
        this.#cache.set(key, value)
        this.#enqueue(() => this.#write('put', key, value))
    }

    removeItem(key) {
        this.#assertOpen()
        this.#cache.delete(key)
        this.#enqueue(() => this.#write('delete', key))
    }

    #assertOpen() {
        if (!this.#db) {
            throw new Error('IndexedDB storage is not open, ready has not settled')
        }
    }

    #write(method, key, value) {
        return new Promise((resolve, reject) => {
            let transaction = this.#db.transaction(this.#storeName, 'readwrite')
            let store = transaction.objectStore(this.#storeName)
            if (method === 'put') {
                store.put(value, key)
            } else {
                store.delete(key)
            }
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
            transaction.onabort = () => reject(transaction.error)
        })
    }

    #enqueue(write) {
        this.#pending = this.#pending
            .then(write)
            .catch(error => {
                // reported, but a failed write must not stop later writes
                console.error('IndexedDBStorage write failed', error)
            })
    }

    async flush() {
        await this.#pending
    }
}
