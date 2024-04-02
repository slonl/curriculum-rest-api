    editor.transformers.option = {
        render: function(data) {
            this.originalValue = data
            if (!!data) {
                return "some"
            } else {
                return "none"
            }
        },
        extract: function(data) {
            return this.originalValue
        }
    }

    editor.transformers.replaces = {
        render: function(data) {
            this.originalValue = data;
            if (Array.isArray(data) && data.length > 0) {
                return "true";
            } else {
                return "false";
            }
        },
        extract: function(data) {
            return this.originalValue;
        }
    };
    
    editor.transformers.truthy = {
        render: function(data) {
            this.originalValue = data;
            if (Array.isArray(data)) {
                return data.length > 0 ? "true" : "false";
            } else if (!Array.isArray(data)) {
                return !!data ? "true" : "false";;
            }
            return "false"
        },
        extract: function(data) {
            return this.originalValue;
        }
    };
    
    editor.transformers.niveau = {
        render: function(data) {
            this.innerHTML = browser.view.item.title;
            return data;
        }
    };
    
    editor.transformers.addTrailingSlash = {
        render: function(data) {
            this.originalValue = data;
            if(data[data.length-1] != "/") {
                data += "/";
            }
            return data;
        },
        extract: function(data) {
            return this.originalValue;
        }
    };

    editor.transformers.idToHref = {
        render: function(data) {
            this.href = data['@references']
            return data
        }
    }

    editor.transformers.entityArrayOrEmpty = {
        render: function(data) {
            if (Array.isArray(data)) {
                return 'array'
            }
            if (data) {
                return 'entity'
            }
            return 'empty'
        }
    }