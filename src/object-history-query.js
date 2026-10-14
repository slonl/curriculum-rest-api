module.exports = `
const object = meta.index.id.get('/uuid/' + request.query.id)

object ? meta.history.get(object).map(entry => ({
    version: entry.version,
    timestamp: entry.timestamp,
    command: entry.command,
    object: entry.object
})) : null
`
