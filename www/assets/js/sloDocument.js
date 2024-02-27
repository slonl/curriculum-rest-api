/*
TODO:

*/

const sloDocument = (function() {
  
  const options = {
  }
  
  return function(settings, data) {
    options.container = settings.container

    let clickListener

    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    function addClickSelectText() {
        if (clickListener) {
            options.container.removeEventListener('click', clickListener)
        }
        clickListener = function() {
          console.log("Too!")
          console.log(this)
        }
        options.container.addEventListener('click', clickListener)
    }
    addClickSelectText()

// WIP --
    function defaultEditor(rect, offset, el) {
      
      let columnDef = getColumnDefinition(el)
      let row = getRow(el)
      let value = row.columns[columnDef.value] || ''
      let values = columnDef.values
      let name
   
      value = htmlEscape(value)
      name = columnDef.value
      let selectorRect = selector.getBoundingClientRect()
      selector.innerHTML = `<form><textarea name="${name}" class="sloDOcument-editor">${value}</textarea></form>`
      selector.querySelector('textarea').style.height = selectorRect.height + 'px'
      selector.querySelector('textarea').focus()

    }

    function showEditor(rect, offset, el) {
      let column = getColumnDefinition(el)
      
      if (!column.editor && typeof column.editor != 'undefined') {
        return
      } 
      selector.dataset.simplyKeyboard = 'sloDocument-edit'
      defaultEditor.call(selector, rect, offset, el)
      
      if (column.editor) {
        column.editor.call(selector, rect, offset, el)
      }
    }



    let sloDocument = {
      addClickSelectText: () => {
        addClickSelectText()
      },

      //WIP--
      selector: (el) => {
        if (!el) {
          selector.style.display = 'none'
          return
        }
        selector.style.display = 'block'
        let offset = table.getBoundingClientRect()
        let rect = el.getBoundingClientRect()
        showSelector(rect, offset, el)
      },
      editor: (el) => {
        if (!el) {
          selector.style.display = 'none'
          return
        }
        selector.style.display = 'block'
        let offset = table.getBoundingClientRect()
        let rect = el.getBoundingClientRect()
        showEditor(rect, offset, el)
      },
      isEditable: (el) => {
        let column = getColumnDefinition(el)
        return column.isEditable(el)
      },
      saveChanges: () => {
        if (!editListeners || !editListeners.length) {
          return
        }
        let el = body.querySelector('focus')
        let columnDef = getColumnDefinition(el)
        let values = new FormData(selector.querySelector('form'))
        let id = el.closest('span').id
        for (listener of editListeners) {
          listener.call(spreadsheet, {
            id,
            property: columnDef.value,
            values
          })
        }
      }
      //  --WIP
    }

    return sloDocument
  
  }

})()