/*
TODO:
+ open/close tree
+ recalculate row index nr after sort
  (count over hidden rows - so 1,2,10,11,etc. hidden rows get counted)

- select cell / focus cell - open hidden rows if needed
  focus cell by its uuid? set uuid id attribute on row
  keep track of node (and thus parents) in row
- cursor navigation - skip hidden rows
- add editors to column definitions
  - text
  - list (many of x)
  - select (one of x)
- tab to next cel
- shift-tab to prev cel
 */

const spreadsheet = (function() {
  const options = {
    rows: 15,
    container: null
  }
  return function(settings, data) {
    options.container = settings.container
    options.columns = settings.columns
    options.icons = settings.icons || ''
    options.rows = settings.rows || 15

    let datamodel = simply.viewmodel.create('largetable', data, {
      offset: 0,
      columns: options.columns,
      rows: options.rows,
      rowHeight: 27,
      closed: {},
      focus: {
        row: 1,
        column: 1
      }
    })

    // tree toggle filter
    datamodel.addPlugin('select', function(params) {
      if (params.toggle) {
        if (this.options.closed[params.toggle]) {
          delete this.options.closed[params.toggle]
          let row = this.view.data.find(r => r.columns.id==params.toggle)
          if (row) {
            row.hidden = 0
          }
        } else {
          this.options.closed[params.toggle]=true
        }
      }
      let closedSubtree = []
      let lastVisibleRow = null
      this.view.data = this.view.data.filter(r => {
        let closed = closedSubtree.length?closedSubtree[closedSubtree.length-1]:0
        let indent = r.indent+1 // make indent start at 1, not 0
        if (closed && closed<indent) {
          lastVisibleRow.hidden = lastVisibleRow.hidden ? lastVisibleRow.hidden+1 : 1
          return false
        }
        if (closed && closed>=indent) {
          closedSubtree.pop()
        }
        if (this.options.closed[r.columns.id]) {
          r.closed = 'closed'
          closedSubtree.push(indent)
        } else {
          r.closed = ''
        }
        lastVisibleRow = r
        return true
      })
      this.view.visibleData = this.view.data.slice()
    })

    // cell value filter
    datamodel.addPlugin('select', function(params) {
      if (!this.options.filter) {
        this.options.filter = {}
      }
      if (typeof params.filter != 'undefined') {
        for (let f in params.filter) {
          if (params.filter[f].length) {
            this.options.filter[f] = params.filter[f]
          } else {
            delete this.options.filter[f]
          }
        }
      }
      this.view.data = this.view.data.filter(row => {
        for(let name in this.options.filter) {
          let filter = this.options.filter[name]
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
              if (!row.columns[name] || row.columns[name].filter(value => value.toLowerCase().search(filter)>-1).length) {
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
    })

    // adds caching of sorted list
    function createSort(options) {
        var defaultOptions = {
            name: 'sort',
            getSort: function(params) {
                return Array.prototype.sort;
            }
        };
        options = Object.assign(defaultOptions, options || {});
        let sorted = []
        return function(params) {
            this.options[options.name] = options;
            if (params[options.name] || sorted.length!=this.view.data.length) {
                options = Object.assign(options, params[options.name]);
                this.view.data.sort(options.getSort.call(this, options));
                sorted = this.view.data.slice()
            }
            this.view.data = sorted
        };
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

    datamodel.addPlugin('render', function(params) {
      if (typeof params.offset != 'undefined') {
        this.options.offset = Math.min(params.offset, this.data.length-1)
      }
      start = this.options.offset
      end = start + this.options.rows
      if (end>this.view.data.length) {
        end = this.view.data.length;
        start = Math.max(0, end - this.options.rows);
      }
      this.view.data = this.view.data.slice(start, end)
      // add row numbers
      let count = 0
      for (let row of this.view.data) {
        row.id = start+count
        if (row.hidden) {
          count+=row.hidden
        }
        count++
      }
      //check focus
      if (typeof params.focus != 'undefined') {
        this.options.focus = params.focus
      }
    });

    options.container.innerHTML = ''
    let table = document.createElement('table')
    table.className = 'slo-tree-table ds-datatable ds-datatable-sticky-header ds-datatable-rulers'
    table.style.position = 'sticky'
    table.style.top = '0px'
    table.style.width = '100%'
    let head = document.createElement('thead')
    let body = document.createElement('tbody')
    table.appendChild(head)
    table.appendChild(body)
    options.container.appendChild(table)
    let helpers = document.createElement('div')
    helpers.classList.add('slo-table-helpers')
    let selector = document.createElement('div');
    selector.classList.add('slo-helper')
    selector.classList.add('slo-cell-selector')
    helpers.appendChild(selector)

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
    <!-- button data-simply-command="filterText" 
        data-simply-value="${column.value}" class="ds-icon-button ds-button ds-button-naked"><svg class="ds-icon ds-icon-feather">
        <use xlink:href="${options.icons}#filter"></use>
    </svg></button -->
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
    </svg></a>
    ${selectButton}
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
      if (datamodel.options.focus?.row == row.id) {
        rowClass += ' focus';
      }
      let html = `<tr id="${row.columns.id}" class="${row.closed}"><td>${row.id+1}</td>`
      let value, count = 0
      let colClass = ''
      for (let column of options.columns) {
        if (!column.checked) {
          continue
        }
        count++
        value = row.columns[column.value] || ''
        if (datamodel.options.focus?.row == row.id && datamodel.options.focus?.column == count) {
          colClass='focus'
        }
        switch(column.type) {
          case 'id': 
            html+= `<td class="${colClass}"><a href="${value}" target="sloSide">#</a></td>`
            break
          case 'tree':
            html+=`<td class="${colClass}" data-simply-command="toggleTree"><span class="slo-indent slo-indent-${row.indent}">${value}</span></td>`
            break
          case 'text':
          default:
            html += `<td class="${colClass}">${value}</td>`
            break
        }
      }
      html += '</tr>'
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
    
    function renderHeading() {
      let heading = `
<tr>
  <th class="ds-datatable-disable-sort slo-rownumber"></th>
`
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

    datamodel.update()

    let spreadsheet = { 
      options: datamodel.options,
      update: (...params) => {
        datamodel.update.apply(datamodel, params)
        renderBody()
      },
      render: () => {
        renderHeading()
        renderBody()
      },
      renderBody: () => {
        renderBody()
      },
      moveLeft: () => {
        spreadsheet.goto(datamodel.options.focus.row, datamodel.options.focus.column-1)
      },
      moveRight: () => {
        spreadsheet.goto(datamodel.options.focus.row, datamodel.options.focus.column+1)
      },
      moveUp: () => {
        spreadsheet.goto(datamodel.options.focus.row-1, datamodel.options.focus.column)
      },
      moveDown: () => {
        spreadsheet.goto(datamodel.options.focus.row+1, datamodel.options.focus.column)
      },
      moveNext: () => {

      },
      movePrev: () => {

      },
      goto: (row, column) => {
          // row/column only count visible rows and columns
          let focus = datamodel.options.focus
          focus.column = Math.max(1, Math.min(datamodel.options.visibleColumns.length, column))
          focus.row = Math.max(1, Math.min(datamodel.view.visibleData.length+1, row))
          if (datamodel.options.offset>row || (datamodel.options.offset+datamodel.options.rows)<=row) {
              let offset = Math.min(Math.max(row - Math.floor(datamodel.options.rows/2), 0), datamodel.view.visibleData.length - datamodel.options.rows);
              if (offset!=datamodel.options.offset) {
                  // FIXME: update scrollbar offset as well
                  datamodel.update({
                      offset,
                      focus
                  })
                  scrollEnabled = false
                  scrollBox.scrollTop = datamodel.options.rowHeight * Math.max(0, focus.row - Math.floor(datamodel.options.rows/2))
                  scrollEnabled = true
                  spreadsheet.renderBody()
              }
          }
          let id = datamodel.data[row]?.columns.id
          if (id) {
              id = new URL(id)
              //FIXME: change a view or fire event instead of this
              window.history.pushState({}, '', new URL(id.pathname.split('/').pop(), window.location))
          }
          var row = row - datamodel.options.offset
          var column = focus.column          
          window.setTimeout(() => {
              Array.from(table.querySelectorAll('.focus'))
              .forEach(r => {
                  r.classList.remove('focus')
              })
              let focus = table.querySelector('tbody tr:nth-child('+(row+1)+')')
              if (focus) {
                  focus.classList.add('focus')
              }
              focus = table.querySelector('tbody tr:nth-child('+(row+1)+') td:nth-child('+(column+1)+')')
              if (focus) {
                  focus.classList.add('focus')
                  spreadsheet.selector(focus)
              }
          },10)
      },
      gotoId: (id) => {
          let row = spreadsheet.findId(id)
          if (row>=0) {
            spreadsheet.goto(row,2)
          }
      },
      findId: (id) => {
          let row = datamodel.data.findIndex(r => r.columns.id==id)
          return row ? row : null
      },
      selector: (el) => {
        if (!el) {
          selector.style.display = 'none'
          return
        }
        selector.style.display = 'block'
        let offset = table.getBoundingClientRect()
        let rect = el.getBoundingClientRect()
        selector.style.top = (rect.top - offset.top)+'px'
        selector.style.left = (rect.left - offset.left)+'px'
        selector.style.width = rect.width+'px'
        selector.style['min-height'] = rect.height+'px'
        selector.innerHTML = el.innerHTML
        let current = selector.getBoundingClientRect()
        if (current.top+current.height > offset.top+offset.height) {
          selector.style.top = (offset.height - current.height)+'px'
        }
        selector.style.display = 'block'
      },
      startEditor: () => {

      },
      stopEditor: () => {

      }
    }
    return spreadsheet
  }
})()
