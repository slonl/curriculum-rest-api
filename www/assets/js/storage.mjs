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
}
