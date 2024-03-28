/*
TODO:

*/

const sloDocument = (function() {
  
  const options = {
  }
  
  return function(settings, data) {
    options.container = settings.container


    // @TODO : need to move the clicklistener to command / action
    let clickListener
   
    // // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    // function addClickSelectText() {
    //     if (clickListener) {
    //         options.container.removeEventListener('click', clickListener)
    //     }
    //     clickListener = function(evt) {
    //       let clickedText = evt.target.closest('.slo-entity')

    //       // templates occasionally generate without any content, only select if there is an ID to select
    //       if(clickedText?.id){
    //         //console.log(clickedText.id)
    //         //console.log(clickedText.innerHTML)
    //         let focussedElement = document.getElementsByClassName("focus")[0];
    //         focussedElement?.classList.remove("focus")
    //         clickedText.classList.add("focus")
              
    //          // replace URL with the new URL
    //          let nextFocussedElement = document.querySelector(".focus");                 
    //          let nextDocumentLocation = new URL(document.location.href);
    //          let idPath = new URL(nextFocussedElement.id);
    //          let nextID = idPath.pathname.split("/").pop();
    //          idPath.pathname = "/uuid/" + nextID;
    //          idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;
    //          window.history.replaceState({}, '', idPath.href);
    //          browser.view.item.uuid = nextID
    //       }

    //     }
    //     options.container.addEventListener('click', clickListener)
    // }
    // addClickSelectText()

    function editDocument(el, value) {
      showEditor(el);
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

    function showEditor(el) {
      const dialog = el.querySelector("dialog");
      dialog.showModal()
      getTextDefinition(el)
    }

    function hideEditor(el){
      const dialog = el.querySelector("dialog");
      dialog.close()
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
        showEditor(el)
        // @TODO : will need some refactoring to move to propper functions
        let addChangeButton = el.querySelector("#addChanges");

        console.log("this works?")
        console.log(addChangeButton)
        addChangeButton.addEventListener('click', (event) => {
          event.preventDefault();
          let textBox = el.querySelector("input")
          console.log("closed a dialog")
          console.log(textBox.value)
          hideEditor(el)
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
        
        nodes[itemIndex].classList.remove("focus");
        
        // moving around
        switch(destination){
          case "top":
            itemIndex = 0;
          break;
          case "bottom":
            itemIndex = nodes.length -1;
          break;
          default:
            itemIndex = Math.floor(nodes.length /2)
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
      }
    }

    return sloDocument
  
  }

})()