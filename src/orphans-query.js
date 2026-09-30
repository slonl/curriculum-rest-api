module.exports = `
const Type = o => JSONTag.getAttribute(o, 'class')
const types = Object.keys(meta.schema.types)
    .filter(type => !meta.schema.types[type].root)
    .filter(type => type !== 'KerndoelUitstroomprofiel')
    .filter(type => type !== 'Deprecated')

let allOrphans = []
for (const type of types) {
    const orphans = from(data[type] || [])
        .filter(o => o && !o.deleted && !o.root?.length)
    allOrphans = allOrphans.concat(orphans)
}

from(allOrphans).select({ type: Type, id: _, title: _ })
`
