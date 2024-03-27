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
        clickListener = function(evt) {
          let clickedText = evt.target.closest('.slo-entity')

          // templates occasionally generate without any content, only select if there is an ID to select
          if(clickedText?.id){
            //console.log(clickedText.id)
            //console.log(clickedText.innerHTML)
            let focussedElement = document.getElementsByClassName("focus")[0];
            focussedElement?.classList.remove("focus")
            clickedText.classList.add("focus")
              
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

        }
        options.container.addEventListener('click', clickListener)
    }
    addClickSelectText()



    // function addChange(el) {

    //   const addChangeButton = el.querySelector("#addChange");

    //   console.log("this works?")
    //   console.log(addChangeButton)

    //   // addChangeButton.addEventListener('click', (event) => {
    //   //   //event.preventDefault();
    //   //   let textBox = el.querySelector("input")
    //   //   console.log("closed a dialog")
    //   //   console.log(textBox.value)

    //   // })
    // }
    // addChange()


    function showEditor(el) {

      //show the correct dialog
      const dialog = el.querySelector("dialog");
      dialog.showModal()

      //fill dialog with text
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
          selector.style.display = 'none'
          return
        }
        //let rect = el.getBoundingClientRect()
        showEditor(el)

// WIP --
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
// --WIP

      },
      saveChanges: (el) => {
        addChanges(el)
        hideEditor(el)
      }

      // saveChanges: () => {
      //   if (!editListeners || !editListeners.length) {
      //     return
      //   }
      //   let el = body.querySelector('focus')
      //   let columnDef = getColumnDefinition(el)
      //   let values = new FormData(selector.querySelector('form'))
      //   let id = el.closest('span').id
      //   for (listener of editListeners) {
      //     listener.call(spreadsheet, {
      //       id,
      //       property: columnDef.value,
      //       values
      //     })
      //   }
      // }
    }

    return sloDocument
  
  }

})()