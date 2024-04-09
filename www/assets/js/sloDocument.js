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

    function getTextDefinition(el) {
       let currentUUID = browser.view.item.uuid
       let textBox = el.querySelector("input")
       textBox.value = currentUUID
    }

    function saveChanges(dialogContent){
    }


    let sloDocument = {
      addClickSelectText: () => {
        addClickSelectText()
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
          selector.style.display = 'none' // @TODO find out if this is needed
          return
        }
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
      },
     
      // @TODO make this into a generic function and get/add "el" element if needed
      move : (indexIncrement) => {

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
        
      },
      moveTo : (destination) => {
        let focussedElement;
        let nodes = getAllNodes()
      
        //find current element to move to the next one
        if(document.getElementsByClassName("focus")[0]){
            focussedElement = document.getElementsByClassName("focus")[0];
        }
        // if no element is focussed, focus the first one
        else{
            focussedElement = nodes[0];
            focussedElement.classList.add("focus")
        }
        
        let itemIndex = nodes.indexOf(focussedElement);
        
        nodes[itemIndex].classList.remove("focus"); // probably will have to move this so it won't break the switch(destination)
        
        let newPosition;
                
        // moving around
        switch(destination){
          case "top":
            itemIndex = 0;
          break;
          case "bottom":
            itemIndex = nodes.length -1;
          break;
          case 'left':{

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
          }
          break;
            
          case 'right':{

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
          }
          break;
          
          default:
            itemIndex = Math.floor(nodes.length /2) //if all goes wrong just go to the middle of the page
        }

        scrollIntoView(nodes, itemIndex)
        nodes[itemIndex].classList.add("focus");
        updateURL()
        
      },
      editDocument: (el) =>{
        editDocument(el);
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