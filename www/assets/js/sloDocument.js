/*
TODO:

*/

const sloDocument = (function() {
  
  const options = {
  }
  
  return function(settings, data) {
    options.container = settings.container

    function editDocument(el, value) {
      showEditorDialog(el);
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
      updateURL()
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

    function showEditorDialog(el) {
      const dialog = el.querySelector("dialog");
      dialog.showModal()
      getTextDefinition(el)
    }

    function closeEditorDialog(dialog){
      dialog.close();
    }

    async function getTextDefinition(el) {
       let currentUUID = browser.view.item.uuid
       console.log(currentUUID);
       let currentContent = browser.view.documentList.index[0].get(currentUUID).title
       console.log(currentContent);
       return currentContent;
    }

    function saveChanges(dialogContent){
    }


    let sloDocument = {
      /*
      addClickSelectText: () => {
        addClickSelectText()
      },
      */
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

      editor: async (el) => {
        //let rect = el.getBoundingClientRect()
        let boxContent = await getTextDefinition(el)
        let currentUUID = browser.view.item.uuid      
        //let title = el.closest('.slo-entity').querySelector('[data-simply-field="title"]').innerHTML
        el.innerHTML = `<form><textarea name="${currentUUID}" class="document-editor">${boxContent}</textarea></form>`

        /*
        showEditorDialog(el)
        // @TODO : will need some refactoring to move to propper functions
        let addChangeButton = el.querySelector("#addChanges");

        console.log("this works?")
        console.log(addChangeButton)
        addChangeButton.addEventListener('click', (event) => {
          event.preventDefault();
          let textBox = el.querySelector("input")
          console.log("closed a dialog")
          console.log(textBox.value)
          console.log(el)
          // closeEditorDialog(el)
        })
        */
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

            // @NOTE: the following commented code was a WIP for when the prefix/title/description was selctable/editable by design, this will probably be a stretch goal at some point
            /*
            if(typeof focussedElement.getElementsByClassName('focus-field')[0]==="undefined"){
              //console.log("No focussed field found, setting focus field to default")
              let currentElement = focussedElement.querySelectorAll('[data-simply-field="prefix"]')[0]
              //console.log(currentPosition)
              currentElement.classList.add("focus-field")
            }
            
            let currentElement = focussedElement.getElementsByClassName('focus-field')[0]
            console.log(currentElement.dataset.simplyField)
                    
            switch (currentElement.dataset.simplyField){
              case 'prefix':
                //current element is already leftmost
              break;
              case 'title': {
                let newPosition = currentElement.closest("focus-field")
                currentElement.classList.remove("focus-field")
                newPosition.classList.add("focus-field")
              }
              break;
              case 'descirption':{
                let newPosition = currentElement.closest("focus-field")
                currentElement.classList.remove("focus-field")
                newPosition.classList.add("focus-field")
              }
              break;
              default:{
                let newPosition = focussedElement.querySelectorAll('[data-simply-field="prefix"]')[0] //prefix is always the most left element
                newPosition.classList.add("focus-field")
              }
            }
            */
          }
          break;
            
          case 'right':{
            move(1)

            // @NOTE: the following commented code was a WIP for when the prefix/title/description was selctable/editable by design, this will probably be a stretch goal at some point
            /*
            if(typeof focussedElement.getElementsByClassName('focus-field')[0]==="undefined"){
              //console.log("No focussed field found, setting focus field to default")
              let currentElement = focussedElement.querySelectorAll('[data-simply-field="description"]')[0]
              //console.log(currentPosition)
              currentElement.classList.add("focus-field")
            }

            let currentElement = focussedElement.getElementsByClassName('focus-field')[0]
            console.log(currentElement.dataset.simplyField)

            switch (currentElement.dataset.simplyField){            //find current position focus
              case 'prefix':{
                let newPosition = currentElement.closest('.slo-entity').querySelector('[data-simply-field="title"]')
                currentElement.classList.remove("focus-field")
                newPosition.classList.add("focus-field")
              }
                //if on prefix move to title
              break;
              case 'title':{
                let newPosition = currentElement.closest('.slo-entity').querySelector('[data-simply-field="description"]')
                currentElement.classList.remove("focus-field")
                newPosition.classList.add("focus-field")
              }
                 //if on title, move to description
              break;
              case 'descirption':{}
                    //current element is already rightmost
              break;
              default:{
                let newPosition = focussedElement.querySelectorAll('[data-simply-field="description"]')[0] //description is always the most right element
                newPosition.classList.add("focus-field")
              }
            }
            */
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
        console.log(el);
        if(el){
          let currentSelection = el;
          currentSelection.innerHTML = "";
        }
      },
      setFocus: (el) =>{
        document.querySelectorAll('.focus').forEach(item => item.classList.remove('focus'));
        let newPosition = el.closest('.slo-entity');
        newPosition.classList.add("focus");
        updateURL()
      },
      saveChanges: (el) => {
        addChanges(el)
        hideEditor(el)
      },
      hideEditorDialog: (el) => {
        closeEditorDialog(el);
      }
    }

    return sloDocument
  
  }

})()