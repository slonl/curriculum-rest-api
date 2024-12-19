/*
TODO:
+ open/close tree
+ recalculate row index nr after sort
  (count over hidden rows - so 1,2,10,11,etc. hidden rows get counted)
- check etag in plugins - if changed redo plugin, otherwise use cached value for data
- select cell / focus cell - open hidden rows if needed
  focus cell by its uuid? set uuid id attribute on row
  keep track of node (and thus parents) in row
 */

const spreadsheet = (function() {

  const options = {
    rows: 15,
    container: null
  }

  return function(settings, data) {
    options.container = settings.container
    options.columns   = settings.columns
    options.icons     = settings.icons || ''
    options.rows      = settings.rows || 15
    options.editMode  = settings.editMode || false
    
    options.columns.forEach(c => {
      if (typeof c.isEditable == 'undefined') {
        c.isEditable = () => {
          return c.editor !== false
        }
      }
    })

    let datamodel = simply.viewmodel.create('largetable', data, {
      offset: 0,
      columns: options.columns,
      rows: options.rows,
      rowHeight: 27,
      closed: {},
      focus: {
        row: 0,
        column: 1
      }
    })

    let pluginCache = new Map()

    // tree toggle filter
    datamodel.addPlugin('select', function(params, data) {
      if (!pluginCache.has(this)) {
        pluginCache.set(this, {
          etag: null,
          data: null
        })
      }
      let cache = pluginCache.get(this)
      if (params.toggle) {
        let index = parseInt(params.toggle.substring(4))
        let row = data.filter(r => r.index==index).pop()
        if (row.node.$hasChildren) {
          cache.etag = null
          if (this.options.closed[index]) {
            delete this.options.closed[index]
            if (row) {
              row.hidden = 0
            }
          } else {
            this.options.closed[index]=true
          }
        }
      }
      if (params.toggleAllOpen) {
        if (Object.keys(this.options.closed).length) {
          cache.etag = null
          this.options.closed = []
        }
      }
      if (data.etag !== cache.etag) {
        cache.etag = data.etag
        let closedSubtree = []
        let lastVisibleRow = null
        cache.data = data.filter(r => {
          let closed = closedSubtree.length?closedSubtree[closedSubtree.length-1]:0
          let indent = r.indent+1 // make indent start at 1, not 0
          if (closed && closed<indent) {
            lastVisibleRow.hidden = lastVisibleRow.hidden ? lastVisibleRow.hidden+1 : 1
            return false
          }
          if (closed && closed>=indent) {
            closedSubtree.pop()
          }
          if (this.options.closed[r.index]) {
            r.closed = 'closed'
            closedSubtree.push(indent)
          } else {
            r.closed = ''
          }
          lastVisibleRow = r
          return true
        })
        cache.data.etag = simply.viewmodel.etag()

      }
      this.view.visibleData = cache.data.slice()
      return cache.data
    })

    // cell value filter
    datamodel.addPlugin('select', function(params, data) {
      if (!pluginCache.has(this)) {
        pluginCache.set(this, {
          etag: null,
          data: null
        })
      }
      let cache = pluginCache.get(this)
      if (!datamodel.options.filter) {
        datamodel.options.filter = {}
      }
      if (typeof params.filter != 'undefined') {
        cache.etag = null
        for (let f in params.filter) {
          if (params.filter[f].length) {
            datamodel.options.filter[f] = params.filter[f]
          } else {
            delete datamodel.options.filter[f]
          }
        }
      }
      if (data.etag !== cache.etag) {
        cache.etag = data.etag
        cache.data = data.filter(row => {
          for(let name in datamodel.options.filter) {
            let filter = datamodel.options.filter[name]
            if (Array.isArray(filter)) {
              if (Array.isArray(row.columns[name])) {
                if (filter.filter(value => row.columns[name].includes(value)).length==0) {
                  return false
                }
              } else {
                if (!filter.includes(row.columns[name])) {
                  return false
                }
              }
            } else {
              filter = filter.toLowerCase()
              if (Array.isArray(row.columns[name])) {
                if (!row.columns[name] || !row.columns[name].filter(value => value.toLowerCase().search(filter)>-1).length) {
                  return false
                }
              } else {
                if (!row.columns[name] || row.columns[name].toLowerCase().search(filter)==-1) {
                  return false
                }
              }
            }
          }
          return true
        })
        cache.data.etag = simply.viewmodel.etag()
      }
      this.view.visibleData = cache.data.slice()
      return cache.data
    })

  
    function createSort(options) {
        var defaultOptions = {
            name: 'sort',
            getSort: function(params) {
                return Array.prototype.sort;
            }
        };
        options = Object.assign(defaultOptions, options || {});

        return function(params, data) {
            if (!pluginCache.has(this)) {
              pluginCache.set(this, {
                etag: null,
                data: null
              })
            }
            let cache = pluginCache.get(this)
            this.options[options.name] = options;
            if (params[options.name] || cache.etag!==data.etag) {
                options = Object.assign(options, params[options.name]);
                cache.etag = data.etag
                cache.data = data.toSorted(options.getSort.call(this, options))
                cache.data.etag = simply.viewmodel.etag()
            }
            this.view.visibleData = cache.data.slice()
            return cache.data
        };
    }

    function toggleFullScreen(state) {
      if (state == "open") {
        document.body.requestFullscreen();  // @FIXME : should be in action and trasmitted as parameter
      } else {
        document.exitFullscreen();
      }
    }
    
    datamodel.addPlugin('order', createSort({
      name: 'sort',
      sortBy: 'prefix',
      sortDirection: 'ascending',
      getSort: (params) => {
        if (!params.sortBy || params.sortBy=='prefix') {
          return (a,b) => 0
        }
        if (params.sortDirection == 'ascending') {
          return (a,b) => (a.columns[params.sortBy]<b.columns[params.sortBy])
        } else {
          return (a,b) => (a.columns[params.sortBy]>b.columns[params.sortBy])
        }
      }
    }))

    datamodel.addPlugin('render', function(params, data) {
      if (!pluginCache.has(this)) {
        pluginCache.set(this, {
          etag: null,
          data: null
        })
      }
      let cache = pluginCache.get(this)
      if (typeof params.offset != 'undefined') {
        cache.etag = null
        this.options.offset = Math.min(params.offset, data.length-1)
      }
      if (cache.etag !== data.etag) {
        cache.etag = data.etag
        start = this.options.offset
        end = start + this.options.rows
        if (end>data.length) {
          end = data.length;
          start = Math.max(0, end - this.options.rows);
        }
        cache.data = data.slice(start, end)
        // add row numbers
        let count = 0
        for (let row of cache.data) {
          row.id = start+count
//          if (row.hidden) {
//            count+=row.hidden
//          }
          count++
        }
        cache.data.etag = simply.viewmodel.etag()
      }
      //check focus
      if (typeof params.focus != 'undefined') {
        this.options.focus = params.focus
      }
      return cache.data
    });

    options.container.innerHTML = ''
    let table = document.createElement('table')
    table.className = 'slo-tree-table ds-datatable ds-datatable-sticky-header ds-datatable-rulers'
    table.style.position = 'sticky'
    table.style.top = '0px'
    table.style.width = '100%'
    let head = document.createElement('thead')
    let body = document.createElement('tbody')
    let foot = document.createElement('tfoot')
    table.appendChild(head)
    table.appendChild(body)
    table.appendChild(foot)
    options.container.appendChild(table)
    let helpers = document.createElement('div')
    helpers.classList.add('slo-table-helpers')
    let selector = document.createElement('div');
    selector.classList.add('slo-helper')
    selector.classList.add('slo-cell-selector')
    helpers.appendChild(selector)

    function htmlEscape(str) {
      return str.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    }

    function defaultEditor(rect, offset, el) {
      let columnDef = getColumnDefinition(el)
      let row = getRow(el)
      let value = row.columns[columnDef.value] || ''
      let values = columnDef.values
      let name
      let selectorRect, disabled, checked
      switch(columnDef.type) {
        case 'autocomplete':
          value = htmlEscape(value)
          name = columnDef.value
          valueOptions = '<option>'+values.map(v => htmlEscape(v.name)).join('</option><option>')+'</option>'
          selectorRect = selector.getBoundingClientRect()
          disabled = row.node.dirty ? 'disabled' : ''
          checked = browser.view.dirtyChecked ? 'checked' : ''
          selector.innerHTML = `
<form data-simply-command="saveChangesSpreadsheet">
  <div class="slo-form-header">
    <button class="ds-button ds-button-naked ds-button-close" data-simply-command="closeEditor">
      <svg class="ds-icon ds-icon-feather">
        <use xlink:href="/assets/icons/feather-sprite.svg#x">
      </use></svg>
    </button>
    <div class="ds-form-group">
      <label>
        <input type="checkbox" ${disabled} ${checked} name="dirty" value="1" data-simply-command="toggleDirty">
        Inhoudelijke wijziging
      </label>
    </div>
  </div>
  <div class="spreadsheet-autosize">
    <input name="${name}" autofocus list="autocomplete" data-replicated-value="${value}" class="spreadsheet-editor spreadsheet-editor-type-${columnDef.type}" value="${value}">
  </div>
  <datalist name="autocomplete">${valueOptions}</datalist>
  <div class="slo-form-footer">
   <button class="ds-button ds-button-naked ds-button-close" type="submit">
      <svg class="ds-icon ds-icon-feather">
        <use xlink:href="/assets/icons/feather-sprite.svg#save">
      </use></svg>
    </button>
  </div>
</form>`;

        break
        case 'checkbox':
          value = !!value
          name = columnDef.value
          selectorRect = selector.getBoundingClientRect()
          disabled = row.node.dirty ? 'disabled' : ''
          checked = browser.view.dirtyChecked ? 'checked' : ''
          let inputChecked = ''
          if (value) {
            inputChecked = 'checked'
          }
          selector.innerHTML = `
<form data-simply-command="saveChangesSpreadsheet">
  <div class="slo-form-header">
    <button class="ds-button ds-button-naked ds-button-close" data-simply-command="closeEditor">
      <svg class="ds-icon ds-icon-feather">
        <use xlink:href="/assets/icons/feather-sprite.svg#x">
      </use></svg>
    </button>
  </div>
  <div class="spreadsheet-autosize">
    <input type="hidden" name="${name}" value="0">
    <label><input type="checkbox" name="${name}" data-replicated-value="${value}" class="spreadsheet-editor spreadsheet-editor-type-${columnDef.type}" value="1" ${inputChecked}> Ja</label>
  </div>
  <div class="slo-form-footer">
   <button class="ds-button ds-button-naked ds-button-close" type="submit">
      <svg class="ds-icon ds-icon-feather">
        <use xlink:href="/assets/icons/feather-sprite.svg#save">
      </use></svg>
    </button>
  </div>
</form>`;
          selector.querySelector('input[type="checkbox"]')?.focus()
        break
        case 'list':
          if (!Array.isArray(value)) {
            value = [ value ]
          }
          let html = `<form><ul>`
          name = columnDef.value
          for (let v of values) {
            if (!v.name) {
              continue
            }
            let checked = value.includes(v.name)
            let val = htmlEscape(v.name)
            html+=`<li><label><input type="checkbox" name="${name}" value="${val}" ${checked}> ${val}</label></li>`
          }
          html+= '</ul></form>'
          selector.innerHTML = html
          selector.querySelector('input[type="checkbox"]')?.focus()
        break
        default:
          value = htmlEscape(value)
          name = columnDef.value
          selectorRect = selector.getBoundingClientRect()
          disabled = row.node.dirty ? 'disabled' : ''
          checked = browser.view.dirtyChecked ? 'checked' : ''
          selector.innerHTML = `
<form data-simply-command="saveChangesSpreadsheet">
  <div class="slo-form-header">
    <button class="ds-button ds-button-naked ds-button-close" data-simply-command="closeEditor">
      <svg class="ds-icon ds-icon-feather">
        <use xlink:href="/assets/icons/feather-sprite.svg#x">
      </use></svg>
    </button>
    <div class="ds-form-group">
      <label>
        <input type="checkbox" ${disabled} ${checked} name="dirty" value="1" data-simply-command="toggleDirty">
        Inhoudelijke wijziging
      </label>
    </div>
  </div>
  <div class="spreadsheet-autosize">
    <textarea name="${name}" data-simply-activate="autosize" rows="1" data-replicated-value="${value}" class="spreadsheet-editor spreadsheet-editor-type-${columnDef.type}">${value}</textarea>
  </div>
  <div class="slo-form-footer">
   <button class="ds-button ds-button-naked ds-button-close" type="submit">
      <svg class="ds-icon ds-icon-feather">
        <use xlink:href="/assets/icons/feather-sprite.svg#save">
      </use></svg>
    </button>
  </div>
</form>`;
          selector.querySelector('textarea').style['height'] = selectorRect.height + 'px'
          selector.querySelector('textarea').focus()
        break
      }
    }

    function defaultViewer(rect,offset,el) {
      const spreadsheetElement = document.getElementById("slo-spreadsheet");
      const spreadsheetSize = spreadsheetElement.getBoundingClientRect();
      const boxWidth = spreadsheetSize.width/1.618 // golden ratio
      const iconSize = 60
      const standardBoxWidth = 300 + iconSize

      let columnDef = getColumnDefinition(el)
      let row = getRow(el)
      selector.innerHTML = ''
      selector.style.top = Math.max(2, (rect.top - offset.top))+'px'
      selector.style.left = (rect.left - offset.left)+'px'
      selector.style.width = Math.max(300, (rect.width))+'px'
      selector.style['min-height'] = rect.height+'px'
      selector.style.overflow = 'auto'
       
      if((rect.left + standardBoxWidth) > spreadsheetSize.width){
        selector.style.left = (rect.left - rect.width - standardBoxWidth) +'px' //looks like the icon width 60 is not in rect.width
        console.log("Move left")
      }

      if((rect.left - standardBoxWidth) < 0){
        selector.style.left = (rect.left + rect.width) +'px' //looks like the icon width 60 is not in rect.width
        console.log("Move right")
      }
  
      if(el.scrollWidth >  boxWidth){  // @TODO doublecheck during code review: 
        selector.style.width = (boxWidth)+'px'
        console.log("make box bigger")
        if((rect.left + iconSize + boxWidth) > spreadsheetSize.width){ //looks like the icon width 60 is not in rect.width
          selector.style.left = (rect.left - rect.width - boxWidth - iconSize) +'px'
          console.log("Move BIG left")
        }
        if((rect.left - boxWidth) < 0){
          selector.style.left = (rect.left) +'px' //looks like the icon width 60 is not in rect.width
          console.log("Move BIG right")
        }
      }  

      let value = row.columns[columnDef.value] || ''
      let header = ''
      if (columnDef.editor!==false) {
        header = `
<button class="ds-button ds-button-naked ds-button-close slo-edit" data-simply-command="cellEditor">
  <svg class="ds-icon ds-icon-feather">
    <use xlink:href="/assets/icons/feather-sprite.svg#edit">
  </use></svg>
</button>
`
      }
      switch(columnDef.type) {
        case 'id':
          selector.innerHTML = header + el.innerHTML
        break
        case 'checkbox':
          selector.innerHTML = header + ( value ? 'Ja' : '')
        break
        case 'list':
          if (!Array.isArray(value)) {
            value = [ value ]
          }
          let html = `<ul>`
          for (let v of value) {
            if (!v) {
              continue
            }
            html+='<li>'+htmlEscape(v)+'</li>'
          }
          html+= '</ul>'
          selector.innerHTML = header + html
        break
        case 'autocomplete':
        default:
          selector.innerHTML = header + htmlEscape(value)
        break
      }
      let current = selector.getBoundingClientRect()
      if (current.top+current.height > offset.top+offset.height) {
        if ((offset.height-current.height)<2) {
          selector.style.top = '2px'
//          selector.style.height = 'calc(100% - 40px)'
        } else {
          selector.style.top = (offset.height - current.height)+'px'
        }
      } else {

      }
      selector.style.display = 'block'
    }

    function getRow(el) {
      let index = parseInt(el.closest('tr').id.substring(4))
      return datamodel.data[index-1]
    }

    function getRowsById(id) {
      let row = datamodel.data.filter(r => r.columns.id==id)
      return row
    }

    function getRowByLine(line) {
      line -= 1;
      return datamodel.data[line]
    }

    function findParentRow(row) {
      let indent = row.indent
      let line = datamodel.view.visibleData.indexOf(row)
      while (line && row.indent>=indent) {
        line--
        row = datamodel.view.visibleData[line]
      }
      return row
    }

    function getColumnDefinition(el) {
      // column definitions are in options.columns
      let td = el.closest('td')
      let visibleColumns = options.columns.filter(c => c.checked)
      let siblingCells = Array.from(td.closest('tr').querySelectorAll('td'))
      while (siblingCells[siblingCells.length-1]!==td) {
        siblingCells.pop()
      }
      siblingCells.pop()
      let focusColumn = siblingCells.length - 1 - (options.editMode ? 1 : 0)
      let column = visibleColumns[focusColumn]
      return column
    }

    function showSelector(rect, offset, el) {
      let column = getColumnDefinition(el)
      delete selector.dataset.simplyKeyboard
      defaultViewer.call(selector, rect, offset, el)
      if (column.viewer) {
        column.viewer.call(selector, rect, offset, el)
      }
    }

    function showEditor(rect, offset, el) {
      let column = getColumnDefinition(el)
      if (!column.editor && typeof column.editor != 'undefined') {
        return
      } 
      selector.dataset.simplyKeyboard = 'spreadsheet-edit'
      defaultEditor.call(selector, rect, offset, el)
      if (column.editor) {
        column.editor.call(selector, rect, offset, el)
      }
    }

    function columnsSelectWidget() {      
      let checked, name, disabled, list = ''
      for (let column of options.columns) {
        let name = column.name
        checked = column.checked ? 'checked' : ''
        disabled = column.disabled ? 'disabled' : ''
        if (disabled) {
          list += `
<li class="ds-dropdown-item">
    <label><input type="checkbox" name="${name}" ${checked} disabled>${name}</label>
</li>`    
        } else {
          list += `
<li class="ds-dropdown-item">
    <label><input type="checkbox" value="1" data-simply-command="toggleColumn" name="${name}" ${checked}>${name}</label>
</li>`
        }
      }

      return `
<label class="ds-dropdown">
    <svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#plus"></use>
    </svg>
    <input type="checkbox" name="slo-filter-state" class="ds-dropdown-state">
    <nav class="ds-dropdown-nav ds-dropdown-right ds-align-left">
        <ul class="ds-dropdown-list">
            ${list}
        </ul>
    </nav>
</label>
`
    }

    function valueChecked(column, value) {
      return column.filteredValues[value] ? 'checked' : ''
    }

    function filterWidget(column) {
      if (!column.filterable) {
        return ''
      }
      if (!column.values || column.values.length>15) {
        return `
<div class="slo-form-inline slo-dropdown-filter">
    <input type="text" name="${column.value}" placeholder="filter" 
        data-simply-command="filterText" data-simply-immediate="true">
</div>`
      } else {
        let html = `<ul class="ds-dropdown-list">`
        let name, count
        for (value of column.values) {
          name = value.name
          count = value.count
          if (!name) {
            continue
          }
          html += `
<li class="ds-dropdown-item">
    <label><input type="checkbox" name="${column.value}" value="${name}" data-simply-command="filterValue" ${valueChecked(column, value)}>
    ${name} (${count})</label>
</li>`
        }
        html +=`</ul>`
        return html
      }
    }
   
    function buttonbarWidget(column) {
      let selectButton = `<a class="ds-button ds-button-naked ds-icon-button" title="selecteer kolom" data-simply-command="copyColumn" data-simply-value="${column.value}"><svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#clipboard"></use>
    </svg></a>`
      let closeButton = `<a class="ds-button ds-button-naked ds-icon-button ds-flex-right" title="sluit" data-simply-command="closeFilter"><svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#x"></use>
    </svg></a>`
      if (!column.sortable) {
        return `<div class="ds-button-group ds-button-bar">${selectButton}</div>`
      }
      if (column.type=='tree') {
        return `
<div class="ds-button-group ds-button-bar">
    <a class="ds-button ds-button-naked ds-icon-button" 
      title="Boomweergave" data-simply-command="sort" 
      data-simply-value="descending" data-name="${column.value}"><svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#columns"></use>
    </svg></a><a class="ds-button ds-button-naked ds-icon-button" title="Open alle rows" data-simply-command="toggleAllOpen"><svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#maximize-2"></use>
    </svg></a>
    ${selectButton}
    ${closeButton}
</div>`
      } else {
        return `
<div class="ds-button-group ds-button-bar">
    <a class="ds-button ds-button-naked ds-icon-button" 
      title="sorteer aflopend" data-simply-command="sort" 
      data-simply-value="descending" data-name="${column.value}"><svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#arrow-down"></use>
    </svg></a>
    <a class="ds-button ds-button-naked ds-icon-button" 
      title="sorteer oplopend" data-simply-command="sort" 
      data-simply-value="ascending" data-name="${column.value}"><svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#arrow-up"></use>
    </svg></a>
    ${selectButton}
    ${closeButton}
</div>`
      }
    }

    function columnOptionsWidget(column) {
      return `
<label class="slo-filter ds-dropdown">
  <svg class="ds-icon ds-icon-feather">
    <use xlink:href="${options.icons}#filter"></use>
  </svg>
  <input type="checkbox" name="slo-filter-state" class="ds-dropdown-state">
  <nav class="ds-dropdown-nav ds-dropdown-right ds-align-left">
    <div class="ds-dropdown-content slo-dropdown-buttons">
      ${buttonbarWidget(column)}
      ${filterWidget(column)}
    </div>
  </nav>
</label>`
    }

    function renderRow(row) {
      let rowClass = row.closed;
      if (datamodel.options.focus?.row == row.index) {
        rowClass += ' focus';
      }
      if (row.deleted) {
        rowClass += ' deleted';
      }
      if (row.changed) {
        rowClass += ' changed';
      }
      if (row.inserted) {
        rowClass += ' inserted'
      }
      let add = ''
      let remove = ''
      if (options.editMode) {
        if (row.deleted) {
          add = `<td></td>`
          remove = `<td><svg data-simply-command="undeleteRow" class="slo-delete ds-icon ds-icon-feather">
              <use xlink:href="${options.icons}#plus-circle"></use>
          </svg></td>` // unremove option here?
        } else {
          add = `<td><svg data-simply-command="insertRow" class="slo-delete ds-icon ds-icon-feather" title="Voeg relatie toe">
              <use xlink:href="${options.icons}#plus-circle"></use>
          </svg></td>`
          remove = `<td><svg data-simply-command="deleteRow" class="slo-delete ds-icon ds-icon-feather">
              <use xlink:href="${options.icons}#x-circle"></use>
          </svg></td>`
        }
      }
      let html = `<tr id="row-${row.index}" data-slo-id="${row.columns.id}" class="${rowClass}">${add}<td class="line">${row.id+1}</td>`
      let value, count = 0
      let colClass = ''
      let focusColumn = datamodel.options.focus.column
      for (let column of options.columns) {
        if (!column.checked) {
          continue
        }
        count++
        value = row.columns[column.value] || ''
        if (datamodel.options.focus?.row == row.index && focusColumn == count) {
          colClass='focus'
        } else {
          colClass=''
        }
        switch(column.type) {
          case 'checkbox':
            let v = value ? "ja" : ""
            html+= `<td class="${colClass}">${v}</td>`
          break
          case 'id': 
            html+= `<td class="${colClass}"><a href="${value}" target="sloSide">#</a></td>`
            break
          case 'tree':
            let $hasChildren = ''
            if (row.node.$hasChildren) {
              $hasChildren = ' slo-has-children'
            }
            html+=`<td class="${colClass}" data-simply-command="toggleTree">
    <span class="slo-indent slo-indent-${row.indent} ${$hasChildren}"><span data-simply-command="selectTreeCell">${value}&nbsp;</span></span>
</td>`
            break
          case 'autocomplete':
          case 'text':
          default:
            html += `<td class="${colClass}">${value}</td>`
            break
        }
      }
      html += `${remove}</tr>`
      return html
    }
    
    function renderBody() {
      let rows = ``
      let count = 0
      for (let row of datamodel.view.data) {
        rows += renderRow(row)
        count++
      }
      if (count<options.rows) {
        for (i=count;i<options.rows;i++) {
          rows += '<tr class="empty"><td>&nbsp;</td></tr>'
        }
      }
      body.innerHTML = rows
      spreadsheet.selector(body.querySelector('td.focus'))
    }
    
    function renderFoot() {
      let colspan = options.columns.filter(c => c.checked).length+2
      let html = `<tr><td colspan="${colspan}"></td></tr>`
      foot.innerHTML = html
    }

    function renderHeading() {
      let add = ''
      if (options.editMode) {
        add = `<th class="ds-datatable-disable-sort slo-minwidth"></th>`
      }
      let heading = `<tr>${add}<th class="ds-datatable-disable-sort slo-rownumber"></th>`
      let col=''
      let visible = []
      for (let column of options.columns) {
        if (!column.checked) {
          continue
        }
        visible.push(column)
        if (!column.filteredValues) {
          column.filteredValues = {}
        }
        col = '<th class="'
        if (!column.sortable) {
          col+="ds-datatable-disable-sort "
        }
        if (column.className) {
          col+=column.className
        }
        col+='">'
        if (column.sortable || column.filterable) {
          col+=columnOptionsWidget(column)
        }
        col+='<label class="slo-column-name">'+column.name+'</label>'
        col+='</th>'
        heading += col
      }
      heading += `<th class="slo-minwidth slo-columns-select ds-datatable-disable-sort">${columnsSelectWidget()}</th></tr>`

      
      // Filters
      heading += `<tr><td></td>`
      if (options.editMode) {
        heading += '<td></td>'
      }

      for (let column of options.columns) {    
        if (!column.checked) {
          continue
        }       
        visible.push(column)
        if (!column.filteredValues) {
          column.filteredValues = {}
        }
        col = '<td id="'
        if (column.value) {
          col+= "filter-"
          col+=column.value
        }
        col += `">`
        col += `</td>`
        heading += col
      }
      
      heading += '</tr>'
      // --filter

      head.innerHTML = heading
      head.querySelector('th:first-child').appendChild(helpers) // here so it flow below the dropdowns, but above cell content
      datamodel.options.visibleColumns = visible
    }

    let scrollEnabled = true
    let scrollBox
    function addScrollbar() {
      let scrollbar = document.createElement('div')
      scrollbar.className = 'scrollbar'
      scrollbar.style.height = (datamodel.options.rowHeight * (datamodel.data.length+1))+'px'
      scrollbar.style.width = '1px'
      options.container.appendChild(scrollbar)

      scrollBox = document.querySelector('.ds-scrollbox')
      scrollBox.addEventListener('scroll', (evt) => {
        if (scrollEnabled) {
          let offset = Math.floor(scrollBox.scrollTop/datamodel.options.rowHeight)
          datamodel.update({ offset })
          renderBody()
        }
      })
      let length = datamodel.data.length
      datamodel.addPlugin('order', () => {
        // must be run before render, because view.data after is always 15 rows
        // must be run after select, because that limits the visible rows
        if (length!=datamodel.view.data.length) {
          length = datamodel.view.data.length
          scrollbar.style.height = (datamodel.options.rowHeight * (datamodel.view.data.length+1))+'px'
        }
      })
    }
    addScrollbar()

    let clickListener
    function addClickSelectCell() {
        if (clickListener) {
            body.removeEventListener('click', clickListener)
        }
        clickListener = function(evt) {
            let command = evt.target.closest('[data-simply-command]')
            if (command) {
                return
            }
            let cell = evt.target.closest('td')
            if (cell) {
                spreadsheet.focus(cell)
            }
        }
        body.addEventListener('click', clickListener)
    }
    addClickSelectCell()

    datamodel.update()

    let changeListeners = []
    let editListeners = []

    let spreadsheet = { 
      options: datamodel.options,
      data: datamodel.data,
      visibleData: datamodel.view.visibleData,
      update: (params) => {
        datamodel.update.call(datamodel, params)
        if (params.data) {
          spreadsheet.data = params.data
        }
        if (params.rows) {
          options.rows = params.rows
          datamodel.options.rows = params.rows
          datamodel.update()
        }
        spreadsheet.visibleData = datamodel.view.visibleData
        renderBody()
        spreadsheet.goto(datamodel.options.focus.row, datamodel.options.focus.column)
      },
      render: () => {
        renderHeading()
        renderBody()
        renderFoot()
      },
      renderBody: () => {
        renderBody()
      },
      moveLeft: () => {
        return spreadsheet.goto(datamodel.options.focus.row, datamodel.options.focus.column-1)
      },
      moveRight: () => {
        return spreadsheet.goto(datamodel.options.focus.row, datamodel.options.focus.column+1)
      },
      moveUp: () => {
        let line = datamodel.view.visibleData.findIndex(r => r.index==datamodel.options.focus.row)
        line = Math.max(0, line-1)
        let row = datamodel.view.visibleData[line]
        return spreadsheet.goto(row.index, datamodel.options.focus.column)
      },
      moveDown: () => {
        let line = datamodel.view.visibleData.findIndex(r => r.index==datamodel.options.focus.row)
        line = Math.min(datamodel.view.visibleData.length, line+1)
        let row = datamodel.view.visibleData[line]
        return spreadsheet.goto(row.index, datamodel.options.focus.column)
      },
      moveNext: () => {
        let column = datamodel.options.focus.column
        let row = datamodel.options.focus.row
        let visibleColumns = options.columns.filter(c => c.checked)
        let visibleRows = datamodel.view.visibleData
        do {
          if (column >= visibleColumns.length) {
            column = 1
            row++
            if (row>visibleRows.length) {
              return false
            }
          } else {
            column++
          }
        } while (visibleColumns[column-1]?.editor === false) 
        return spreadsheet.goto(row, column)
      },
      movePrev: () => {
        let column = datamodel.options.focus.column
        let row = datamodel.options.focus.row
        let visibleColumns = options.columns.filter(c => c.checked)
        do {
          if (column <= 1 ) {
            column = visibleColumns.length
            row--
            if (row<1) {
              return false
            }
          } else {
            column--
          }
        } while (visibleColumns[column-1]?.editor === false)
        return spreadsheet.goto(row, column)
      },
      focus: (cell) => {
        let current = body.querySelectorAll('.focus')
        current.forEach(el => {
            el.classList.remove('focus')
        })
        cell.classList.add('focus')
        let tr = cell.closest('tr')
        tr.classList.add('focus')
        let row = parseInt(tr.id.substring(4))
        if (row!==null) {
            let columns = Array.from(cell.closest('tr').querySelectorAll('td'))
            let column = columns.findIndex(td => td===cell)
            if (options.editMode) {
              column--
            }
            spreadsheet.goto(row,column)
        }
      },
      goto: (row, column) => {
          // row/column only count visible rows and columns
          // FIXME: row now used index, so all rows
          // row = Math.max(0, Math.min(datamodel.view.visibleData.length-1, row))
          let line = datamodel.view.visibleData.findIndex(r => r.index==row)
          column = Math.max(1, Math.min(datamodel.options.visibleColumns.length, column))
          let focus = datamodel.options.focus
          focus.column = column
          focus.row = row
          if (datamodel.options.offset>line || (datamodel.options.offset+datamodel.options.rows)<=line) {
              let offset = Math.min(Math.max(line - Math.floor(datamodel.options.rows/2), 0), datamodel.view.visibleData.length - datamodel.options.rows);
              if (offset!=datamodel.options.offset) {
                  // FIXME: update scrollbar offset as well
                  datamodel.update({
                      offset
                  })
                  scrollEnabled = false
                  //FIXME: doesn't take closed rows into account
                  scrollBox.scrollTop = datamodel.options.rowHeight * Math.max(0, line - Math.floor(datamodel.options.rows/2))
                  scrollEnabled = true
              }
          }
          datamodel.update({ focus })
          spreadsheet.renderBody()
          let el = table.querySelector('td.focus')
          spreadsheet.selector(el)
          let id = datamodel.view.visibleData[line]?.columns.id
          if (id) {
              id = new URL(id, document.location.href)
              if (changeListeners) {
                  changeListeners.forEach(listener => listener.call(spreadsheet, id))
              }
          }
          return el
      },
      onEdit: (listener) => {
        editListeners.push(listener)
      },
      onChange: (listener) => {
        changeListeners.push(listener)
      },
      gotoId: (id) => {
          let row = spreadsheet.findId(id)
          if (row>=0) {
            spreadsheet.goto(row,2)
          }
      },
      findId: (id) => {
          let row = datamodel.view.visibleData.findIndex(r => r.columns.id==id)
          return row>=0 ? row : null
      },
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
        let el = body.querySelector('td.focus')
        let columnDef = getColumnDefinition(el)
        let values = new FormData(selector.querySelector('form'))
        let id = el.closest('tr').id
        for (listener of editListeners) {
          listener.call(spreadsheet, {
            id,
            property: columnDef.value,
            values
          })
        }
      },
      findParentRow,
      getRow,
      getRowsById,
      getRowByLine: (line) => {
        return datamodel.view.visibleData[line]
      },
      getRowByNode: (node) => {
        return datamodel.view.visibleData.filter(row => row.node==node).pop()
      },
      getLineByRow: (row) => {
        return datamodel.view.visibleData.findIndex(r => r==row)
      },
      getColumnDefinition,
      toggleFullScreen,
      search: (text) => {
        let results = []
        let textRe = new RegExp(text, 'g')
        datamodel.data.forEach((row, rowIndex) => {
          datamodel.options.columns.forEach((column, colIndex) => {
            if (column.checked) { //visible
              const value = row.columns[column.value]
              if (typeof value == 'string') {
                const matches = value.matchAll(textRe)
                for (const match of matches) {
                  results.push({
                    row: rowIndex+1,
                    column: colIndex+1,
                    offset: match.index
                  })
                }
              }
            }
          })
        })
        return results
      }
    }
    return spreadsheet
  }
})()

simply.activate.addListener('autosize', function() {
    this.addEventListener('input', () => {
        this.parentNode.dataset.replicatedValue = this.value
        //@TODO: this makes the textarea only grow, never shrink, but it is re-initialized on navigation, so all good for now
        this.style.height = this.parentNode.getBoundingClientRect().height+'px'
    })
})