const sloDocument = (function() {
  
  const options = {
  }
  
  return function(settings, data) {
    options.container = settings.container

    // @TODO : check with senior dev if using this instead of reading the URL to get the UUID to save the data is a workable solution
    let currentIdentifier;
    let editListeners = [];

    function showEditor() {
      let editBox = document.querySelector(".documentEditorWrapper");
      editBox.style.display = "flex";
      let title = getTitle()
      let textEditor = editBox.querySelector("textarea");
      document.body.dataset.simplyKeyboard = 'document-edit'  
      textEditor.value = title;
      textEditor.focus();
      // @TODO : on saving the uuid must NOT come from the browser adress bar URL as this can be "accidentally" edited by the user.

    }

    function hideEditor(){
      document.body.dataset.simplyKeyboard = 'document'
      let editBox = document.querySelector(".documentEditorWrapper");
      editBox.style.display = "none";
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

    function getTitle() {
       let currentUUID = browser.view.item.uuid
       currentIdentifier = currentUUID;
       //console.log(data.index)
       let currentContent = data.index.get(currentUUID).title
       return currentContent;
    }

    async function render(){
        //window.location.reload()
        browser.actions.switchView('Documentweergave')
    }

    function  documentSaveChanges(){
      let editBox = document.querySelector(".documentEditorWrapper");
      let textEditor = editBox.querySelector("textarea");
      let newValue = textEditor.value;
      let prevValue = getTitle();
      let dirty = browser.view.dirtyChecked==1
      let timestamp = new Date().toISOString()
      let change = new changes.Change({
          id: currentIdentifier,
          meta: {
              context: window.slo.getContextByType(data.root["@type"]),
              title: prevValue ?? '[Geen titel]',
              type: data.root["@type"],
              timestamp: timestamp.substring(0, timestamp.indexOf('.')),
          },
          type: 'patch',
          property: 'title',
          prevValue : prevValue,
          newValue : newValue,
          $mark : 'changed',
          dirty
      })
      changes.changes.push(change)
      changes.update()
      render();
    };

    let sloDocument = {
     
      // @TODO make this into a generic function and get/add "el" element if needed
      move : (indexIncrement) => {
        move(indexIncrement);
        updateURL();
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
        }
        updateURL();
      },
      showEditor,
      hideEditor,
      setFocus: (el, value) =>{
        document.querySelectorAll('.focus').forEach(item => item.classList.remove('focus'));
        let newPosition = el.closest('.slo-entity');
        newPosition.classList.add("focus");
        updateURL()
      },
      onEdit : () => {
        //documentSaveChanges()
        //hideEditor()
        //updateURL()
      },
      documentSaveChanges: () => {
        documentSaveChanges()
        hideEditor()
        // @TODO rerender page showing edits on inserted green lines and crowssed through red lines <- this will happen automagically by css
        updateURL(); // @TODO: check if it's needed
      },
    }

    return sloDocument
  
  }

})()