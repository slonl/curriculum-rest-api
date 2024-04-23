/*
@TODO : 

*/

const sloDocument = (function() {
  
  const options = {
  }
  
  return function(settings, data) {
    options.container = settings.container

    let selector = document.createElement('div');
    let originalElement = '';
    
    /*
    function getColumnDefinition(el) {
      // column definitions are in options.columns
      let visibleColumns = options.columns.filter(c => c.checked)
      let siblingCells = Array.from(el.closest('tr').querySelectorAll('td'))
      while (siblingCells[siblingCells.length-1]!==el) {
        siblingCells.pop()
      }
      siblingCells.pop()
      let focusColumn = siblingCells.length - 1 - (options.editMode ? 1 : 0)
      let column = visibleColumns[focusColumn]
      return column
    }
    */

    function showSelector(rect, el) {
      let titleContent = getTextDefinition(el)
      
      /*
      if (!titleContent && typeof titleContent != 'undefined') {
        return
      }
      */

      //selector.dataset.simplyKeyboard = 'document-editor';
      let currentUUID = browser.view.item.uuid
      el.innerHTML = `<div><textarea name="${currentUUID}">${titleContent}</textarea></div>`
      /*
      let column = getColumnDefinition(el)
      delete selector.dataset.simplyKeyboard
      defaultViewer.call(selector, rect, offset, el)
      if (column.viewer) {
        column.viewer.call(selector, rect, offset, el)
      }
      */
    }

    function showEditor(el) {

      originalElement = el;
      console.log(originalElement);
      let titleContent = getTextDefinition(el);
      selector.dataset.simplyKeyboard = 'document-edit'; // @TODO : switch keyboard to 'document-edit' doesn't seem to work, as subsequently code in the databrowser.commands.document-edit with "ctrl+enter" doesn't work.
      let currentUUID = browser.view.item.uuid;
      el.innerHTML = `<div><form><textarea name="${currentUUID}" class="document-editor">${titleContent}</textarea></form></div>`;

      // @TODO : maybe add a return element or something here so the ctrl+enter has an element to hook onto.
    }

    function hideEditor(el){
      //el.innerHTML = "";
      console.log(el)
      console.log(originalElement);
      el.innerHTML = originalElement;
    }

    function move(indexIncrement){
      let focussedElement;
      let nodes = getAllNodes()

      //find current element to move to the next one
      if(document.getElementsByClassName("focus")[0]){
          focussedElement = document.getElementsByClassName("focus")[0];
      }
      else{
          focussedElement = nodes[0];
          focussedElement.classList.add("focus")
      }

      let itemIndex = nodes.indexOf(focussedElement);
      nodes[itemIndex].classList.remove("focus");
      
      // moving around
      itemIndex = itemIndex + indexIncrement;
      
      if( itemIndex > (nodes.length -1)) {
          itemIndex = nodes.length -1;
      }
      
      if ( itemIndex < 0) {
        itemIndex = 0;
      }

      scrollIntoView(nodes, itemIndex)
      nodes[itemIndex].classList.add("focus");
      updateURL();
    }

    function scrollIntoView(nodes, itemIndex){
        nodes[itemIndex].scrollIntoView({ block: "center" });
    }

    function getAllNodes(){
      let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
      return getAllNodes;
    }

    function updateURL(){
        // replace URL with the new URL
        let nextFocussedElement = document.querySelector(".focus");                   
        let nextDocumentLocation = new URL(document.location.href);
        let idPath = new URL(nextFocussedElement.id);
        let nextID = idPath.pathname.split("/").pop();
        idPath.pathname = "/uuid/" + nextID;
        idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;
        window.history.replaceState({}, '', idPath.href);
        browser.view.item.uuid = nextID
    }

    function getTextDefinition(el) {
       let currentUUID = browser.view.item.uuid
       let currentContent = data.index.get(currentUUID).title
       return currentContent;
    }

    function saveChanges(el){
      console.log("saving changes")
      console.log(el)
      focussedElement = document.getElementsByClassName("document-editor")[0];
      console.log(focussedElement);

    }

    // @TODO : figure out if this was the trick used to move the "click" "around".
    // let clickListener
    // function addClickSelectCell() {
    //     if (clickListener) {
    //         body.removeEventListener('click', clickListener)
    //     }
    //     clickListener = function(evt) {
    //         let command = evt.target.closest('[data-simply-command]')
    //         if (command) {
    //             return
    //         }
    //         let cell = evt.target.closest('div')
    //         if (cell) {
    //             let current = body.querySelectorAll('.focus')
    //             current.forEach(el => {
    //                 el.classList.remove('focus')
    //             })
    //             cell.classList.add('focus')
    //             cell.closest('span').classList.add('focus')
    //             /*
    //             let row = spreadsheet.findId(cell.closest('tr').id)
    //             if (row!==null) {
    //                 let columns = Array.from(cell.closest('tr').querySelectorAll('td'))
    //                 let column = columns.findIndex(td => td===cell)
    //                 if (options.editMode) {
    //                   column--
    //                 }
    //                 spreadsheet.goto(row,column)
    //             }
    //             */
    //         }
    //     }
    //     body.addEventListener('click', clickListener)
    // }
    // addClickSelectCell();


    let sloDocument = {
      selector: (el) => {
        if (!el) {
          selector.style.display = 'none'
          return
        }
        selector.style.display = 'block'
        let rect = el.getBoundingClientRect()
        showSelector(rect, el)
      },

      saveChanges: (el) => {
        saveChanges(el);
      },

      editor: async (el) => {
          if (!el) {
            selector.style.display = 'none'
            return
          }
          selector.style.display = 'block'
          //let offset = table.getBoundingClientRect()
          showEditor(el)
      },
     
      // @TODO make this into a generic function and get/add "el" element if needed
      move : (indexIncrement) => {
        move(indexIncrement);
      },

      moveTo : (destination) => {
        let focussedElement;
        let nodes;
        let itemIndex;
                
        // moving around
        switch(destination){
          case "top":
            focussedElement;
            nodes = getAllNodes()
          
            //find current element to move to the next one
            if(document.getElementsByClassName("focus")[0]){
                focussedElement = document.getElementsByClassName("focus")[0];
            }
            // if no element is focussed, focus the first one
            else{
                focussedElement = nodes[0];
                focussedElement.classList.add("focus")
            }
            
            itemIndex = nodes.indexOf(focussedElement);
            
            nodes[itemIndex].classList.remove("focus"); // probably will have to move this so it won't break the switch(destination)
            
            //let newPosition;
            itemIndex = 0;
            scrollIntoView(nodes, itemIndex)
            nodes[itemIndex].classList.add("focus");
            updateURL()
          break;
          case "bottom":
            focussedElement;
            nodes = getAllNodes()
          
            //find current element to move to the next one
            if(document.getElementsByClassName("focus")[0]){
                focussedElement = document.getElementsByClassName("focus")[0];
            }
            // if no element is focussed, focus the first one
            else{
                focussedElement = nodes[0];
                focussedElement.classList.add("focus")
            }
            
            itemIndex = nodes.indexOf(focussedElement);
            
            nodes[itemIndex].classList.remove("focus"); // probably will have to move this so it won't break the switch(destination)
            
            //let newPosition;
            itemIndex = nodes.length -1;
            scrollIntoView(nodes, itemIndex)
            nodes[itemIndex].classList.add("focus");
            updateURL()
          break;
          case 'left':{
            move(-1);  
          }
          break;
          case 'right':{
            move(1)        
          }
          break;
          default:
            itemIndex = Math.floor(nodes.length /2) //if all goes wrong just go to the middle of the page
            scrollIntoView(nodes, itemIndex)
            nodes[itemIndex].classList.add("focus");
            updateURL()
        }
      },
      deselect: (el) => {
        console.log("deselecting");
        hideEditor(el)
      },
      setFocus: (el, value) =>{
        document.querySelectorAll('.focus').forEach(item => item.classList.remove('focus'));

        let newPosition = el.closest('.slo-entity');
        newPosition.classList.add("focus");

        // @TODO : trigger a redraw or something if there is text being edited so as to "restore" that field in the DOM
        //browser.actions.renderDocumentPage()

        updateURL()
      },
      saveChanges: (el) => {
        saveChanges(el)
        rerenderView() // @TODO : still need to find a way that this works.
        // hideEditor(el)
      },
    }

    return sloDocument
  
  }

})()