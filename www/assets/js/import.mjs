let niveaus = []
export async function importXLSX(file, schemas, levels) {
	var errors = []
	let state = {}
	niveaus = levels || []

	let f = await readFile(file)
	console.log(f)
	state = { name: file.name, data: f.target.result }
	let workbook = XLSX.read(state.data, {
		type: 'binary'
	})
	state.sheets = {}
	workbook.SheetNames.forEach(function(sheetName) {
		state.sheets[sheetName] = XLSX.utils.sheet_to_row_object_array(
			workbook.Sheets[sheetName]
		)
	})
	state.combined = []
	Object.keys(state.sheets).forEach(function(sheetName) {
		state.combined = state.combined.concat(state.sheets[sheetName])
	})
	state.tree = treeFromArray(state.combined, schemas)
	return state.tree
}

async function readFile(file) {
	return new Promise((resolve,reject) => {
		var reader = new FileReader()
		reader.onload = resolve
		reader.onerror = reject
		reader.readAsBinaryString(file)
	})
}

function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function isUUID(id) {
	return id && (typeof id=='string') && id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
}

function createUUID(id, tree) {
	if (!id) {
		return uuid()
	}
	if (!tree.index.uuid.has(id)) {
		tree.index.uuid.set(id, uuid())
	}
	return tree.index.uuid.get(id)
}

const aliases = {
	'Title':'title',
	'Description':'description',
	'Level':'niveaus',
	'Prefix':'prefix',
	'Type':'@type'
}

const TypeAliases = {}

function parseLevels(levels) {
	let nodeNiveaus = levels.split(',').map(level => level.trim().toLowerCase())
	return niveaus.filter(n => nodeNiveaus.includes(n.title))
}

function createNode(row, line, tree) {
	let node = {}
	node.$row = row
	node.$line = line
	node.id = row.ID ?? row.id
	delete row.ID
	delete row.id
	if (!isUUID(node.id)) {
		node.id = createUUID(node.id, tree)
	}
	node['@id'] = window.release.apiPath+'uuid/'+node.id
	if (row.ParentID) {
		node.$parentId = row.ParentID
		delete row.ParentID
		if (!isUUID(node.$parentId)) {
			node.$parentId = createUUID(node.$parentId, tree)
		}
	}
	if (!tree.index.id.has(node.id)) {
		tree.index.id.set(node.id, [])
	}
	let nodes = tree.index.id.get(node.id)
	nodes.push(node) // there can be more rows with the same id in a sheet, keep them seperate for now
	Object.keys(row).forEach(column => {
		let value = (''+row[column]).trim()
		if (aliases[column]) {
			column = aliases[column]
		}
		if (value=="``") {
			value = ""
		}
		node[column] = value
	})
	if (node.type) {
		node['@type'] = node.type
		delete node.type
	}
	if (node['@type'] && TypeAliases[node['@type']]) {
		node['@type'] = TypeAliases[node['@type']]
	}
	if (!node['@type']) {
		tree.errors.push(new Error('Geen type opgegeven', {cause:node}))
	} else if (!tree.schemas.types[node['@type']]) {
		tree.errors.push(new Error('Onbekend type: '+node['@type'], {cause:node}))
	} else {
		// check that all properties are known
		let schema = tree.schemas.types[node['@type']]
		Object.keys(node).forEach(property => {
			if (property=='level' || property=='niveaus') {
				node.Niveau = parseLevels(node[property])
				delete node[property]
				return
			}
			if (property[0]!='@' && property[0]!='$') {
				if (!schema.properties[property] && schema.properties[property.toLowerCase()]) {
					property = property.toLowerCase()
				}
				if (!schema.properties[property]) {
					tree.errors.push(new Error('Onbekende property: '+property, {cause:node}))
				} else {
					switch(schema.properties[property].type) {
						case 'string':
							node[property] = ''+node[property]
							if (schema.properties[property].enum) {
								if (!schema.properties[property].enum.includes(node[property])) {
									tree.errors.push(new Error('Onbekende waarde voor property (enum): '+property, {cause:node}))
									return
								}
							}
							break
						case 'array':
							if (!Array.isArray(node[property])) {
								tree.errors.push(new Error('Property is geen array: '+property, {cause:node}))
								return
							}
							break
						case 'boolean':
							node[property] = !!node[property]
							break
						case 'integer':
							if (typeof node[property] === 'string' || node[property] instanceof String) {
								if (isNaN(Number(node[property]))) {
									tree.errors.push(new Error('Property is geen integer: '+property, {cause: node}))
									return
								} else {
									node[property] = +node[property]
								}
							}
							if (typeof schema.properties[property].minimum!='undefined') {
								if (node[property] < schema.properties[property].minimum) {
									tree.errors.push(new Error('Property is kleiner dan opgegeven minimum: '+property, {cause: node}))
								}
							} 
							if (typeof schema.properties[property].maximum!='undefined') {
								if (node[property] > schema.properties[property].maximum) {
									tree.errors.push(new Error('Property is froter dan opgegeven maximum: '+property, {cause: node}))
								}
							}
							break
					}
				}
			}
		})
	}
	return node
}

function linkNodes(tree) {
	// for each node in tree.index.id 
	tree.index.id.forEach((nodes, id) => {
		// first combine the nodes into a single node
		let node = combineNodes(nodes)
		tree.index.id.set(id, node)
	})
	tree.index.id.forEach((node, id) => {
		// then for all child properties, link the node under the $parentId node
		let parents = new Set()
		node.$parentId?.forEach(id => {
			let parent = tree.index.id.get(id)
			if (parent) {
				parents.add(parent)
			} else {
				tree.errors.push(new Error('Kan opgegeven parentID '+id+' niet vinden in deze sheet', {cause:node}))
			}
		})
		delete node.$parentId
		// $parentId must have been combined and linked before child id's
		if (!parents.size) {
			tree.roots.push(node)
		} else {
			//FIXME: handle doelniveaus seperately?
			parents.forEach(parent => {
				let schema = tree.schemas.types[parent['@type']]
				if (schema && !schema.children[node['@type']]) {
					schema = tree.schemas.types[node['@type']]
					if (!schema || !schema.children[parent['@type']]) {
						// inverse relation also not allowed
						tree.errors.push(new Error('Onbekende parent-child relatie: '+node['@type'],{cause:node}))
						return
					} else {
						if (tree.roots.includes(parent)) {
							// replace it with node
							tree.roots = tree.roots.map(n => {
								if (n==parent) {
									return node
								}
								return n
							})
						}

						let p = parent
						parent = node
						node = p
					}
				}
				if (!parent[node['@type']]) {
					parent[node['@type']] = []
				}
				if (tree.schemas.types[parent['@type']].properties[node['@type']]?.type=='object') {
					parent[node['@type']] = node // erk_vakleergebied.vakleergebied_id is not an array, for example.
				} else {
					parent[node['@type']].push(node)
				}
			})
		}
	})
}

function combineNodes(nodes) {
	let combined = {}
	nodes.forEach(node => {
		Object.entries(node).forEach(([key, value]) => {
			if (key[0]=='$' || key=='$parentId') {
				if (!combined[key]) {
					combined[key] = []
				}
				combined[key].push(value)
			} else if (!combined[key]) {
				combined[key] = value
			} else if (Array.isArray(value)) {
				if (!Array.isArray(combined[key])) {
					combined[key] = [ combined[key]]
				}
				combined[key] = Array.from(new Set([...combined[key].concat(value)]))
			} else if (combined[key]!=value) {
//				debugger
				throw new Error('Same node with different values for property: '+key, {cause:nodes})
			}
		})
	})
	return combined
}

function walk(node, callback) {
	callback(node)
	Object.keys(node)
	.filter(prop => prop[0]>='A' && prop[0]<='Z' && Array.isArray(node[prop]))
	.map(prop => {
		node[prop].forEach(n => walk(n, callback))
	})
}

function validate(tree) {
	if (!tree.roots || !tree.roots.length) {
		tree.errors.unshift(new Error('Geen root node gevonden'))
	}
	// check that each parent/child link is valid according to the schemas
	tree.roots.forEach(root => {
		walk(root, node => {
			let schema = tree.schemas.types[node['@type']];
			if (!schema) {
				return // error already noted earlier
			}
			Object.keys(node).forEach(property => {
				if (property[0]>='A' && property[0]<='Z') { // uppercase properties are links
					if (!schema.children[property]) {
						tree.errors.push(new Error('Onbekende child relatie: '+property, {cause:node}))
					}
				}
			})
		})
	})
}

function treeFromArray(arr, schemas) {
	Object.keys(schemas.types).forEach(typeName => {
		TypeAliases[schemas.types[typeName].label] = typeName
	})

	const tree = {
		index: {
			id: new Map(),
			uuid: new Map()
		},
		errors: [],
		roots: [],
		schemas
	}

	arr.forEach((row,index) => {
		createNode(row, index+2,tree) // sheet is 1-indexed and has a header row
	})

	linkNodes(tree)
	validate(tree)
	return tree
}