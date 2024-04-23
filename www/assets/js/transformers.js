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
            this.closest('a').href = data
            return data
        }
    }

    editor.transformers.entityArrayOrEmpty = {
        render: function(data) {
            if (Array.isArray(data)) {
                if (!data.length) {
                    return 'empty'
                }
                return 'array'
            }
            if (data && data.title) {
                return 'entity'
            }
            return 'empty'
        }
    }

    editor.transformers.parentClass = {
        render: function(data) {
            // this is a workaround for a problem with using $mark and transformer to set the class
            // $mark is undefined after switchView
            // by not directly using $mark on the parent, the problem is gone
            this.parentElement.classList.add('slo-mark-'+data)
            return data
        }
    }