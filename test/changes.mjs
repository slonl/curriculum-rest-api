import changes from '../www/assets/js/changes.mjs'
import tap from 'tap'

let fixtures = {
    updateChange: {
        id: 'id of the entity',
        meta: {
            context: 'bar',
            type: 'Type of the entity',
            title: 'Title of the change',
            timestamp: 'Time of the change'
        },
        type: 'patch',
        newValue: 'Bar',
        property: 'bar',
        prevValue: 'baz',
        dirty: true
    },
    addEntityChange: {
        id: 'id of the entity',
        meta: {
            context: 'bar',
            type: 'Type of the entity',
            title: 'Title of the change',
            timestamp: 'Time of the change'
        },
        type: 'new',
        newValue: {
            id: 'id of the entity',
            title: 'a new title'
        }
    },
    arrayChanges: {
        id: 'id of the entity',
        meta: {
            context: 'bar',
            type: 'Type of the entity',
            title: 'Title of the change',
            timestamp: 'Time of the change'
        },
        type: 'patch',
        newValue: [{
            id: 'inserted child id',
            $mark: 'inserted'
        },{
            id: 'deleted child id',
            $mark: 'deleted'
        }, {
            id: 'changed child id',
            $mark: 'changed'
        }],
        property: 'bar',
        prevValue: [{
            id: 'deleted child id'
        }, {
            id: 'changed child id'
        }],
        dirty: true
    },
    merges: [
        {
            id: 'object1',
            meta: {
                context: 'bar',
                type: 'baz',
                title: 'change 1',
                timestamp: 'time1'
            },
            type: 'new',
            newValue: {
                id: 'object1'
            }
        },
        {
            id: 'object1',
            meta: {
                context: 'bar',
                type: 'baz',
                title: 'change 2',
                timestamp: 'time2'
            },
            type: 'patch',
            property: 'title',
            prevValue: null,
            newValue: 'A new title',
            dirty: true
        }
    ]
}

tap.test('create update change', t => {
    let c = new changes.Change(fixtures.updateChange)
    t.ok(c.dirty)
    t.end()
})

tap.test('create new/addEntity change', t => {
    let c = new changes.Change(fixtures.addEntityChange)
    t.ok(c.newValue)
    t.end()
})

tap.test('hydrate change', t => {
    let c = new changes.Change(fixtures.arrayChanges)
    t.ok(c.newValue[0] instanceof changes.InsertedLink)
    t.ok(c.newValue[1] instanceof changes.DeletedLink)
    t.end()
})

tap.test('changes list', t => {
    let c = new changes.Changes([
        fixtures.updateChange,
        fixtures.addEntityChange,
        fixtures.arrayChanges
    ])
    t.ok(c instanceof changes.Changes)
    t.same(3, c.length)
    t.end()
})

tap.test('merged list', t => {
    let c = new changes.Changes(fixtures.merges)
    let m = c.merge()
    t.ok(m['object1'])
    t.same('A new title',m['object1']['@properties'].title.newValue)
    t.end()
})