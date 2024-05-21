window.localAPI = (function() {
	return {
        list: function(type) {
            return window.slo.api.get(window.release.apiPath+type, {
                pageSize: browser.view.pageSize,
                page: parseInt(browser.view.page)-1
            })
            .then(function(json) {
                changes.getLocalView(json.data)
                //add inserted entities matching type
                return json
            })
        },
        spreadsheet: function(root, context, niveau) {
            return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                niveau, context
            })
            .then(function(json) {
                changes.getLocalView(json)
                //add inserted entities matching root, context, niveau
                return json
            })
            .catch(function(error) {
            	alert('nyi')
            	//if root is inserted entity, return it, filter children on context and niveau
            	//return json
            })
        },
        document: function(root, context, niveau) {
	        return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                niveau, context
            })
            .then(function(json) {
                changes.getLocalView(json)
                //add inserted entities matching root, context, niveau
                return json
            })
            .catch(function(error) {
            	alert('nyi')
            	//if root is inserted entity, return it, filter children on context and niveau
            	//return json
            })
        },
        doelniveauList: function(type) {
	        return window.slo.api.get(window.release.apiPath+type)
            .then(function(json) {
                changes.getLocalView(json.data)
                //add inserted entities matching type
                return json
            })
        },
        item: function(id) {
	        return window.slo.api.get(window.release.apiPath+'uuid/'+id+'/')
            .then(function(json) {
                changes.getLocalView(json)
                return json
            })
            .catch(function(error) {
            	// return inserted entity matching id
//                return json
            })
        },
        listOpNiveau: function(niveau, type) {
            return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type)
            .then(function(json) {
                changes.getLocalView(json)
                //add inserted entities matching type, niveau
                return json
            })
        },
        itemOpNiveau: function(niveau, type, id) {
        	return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type+id)
            .then(function(json) {
                changes.getLocalView(json)
                return json
            })
            .catch(function(error) {
            	alert('nyi')
            	// return inserted entity matching id, niveau, type
//                return json
            })
        },
        roots: function(id) {
        	return window.slo.api.get(window.release.apiPath+'roots/'+id)
        	.catch(function(error) {
            	alert('nyi')
        		//if id is inserted entity, return its roots property
        		//return json
        	})
        },
        schemas: function() {
        	return window.slo.api.get(window.release.apiPath+'schemas/', null, true) //jsontag
        }
	}
})()