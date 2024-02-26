/*
TODO:

*/

const sloDocument = (function() {
  const options = {
  }
  return function(settings, data) {
    options.container = settings.container

  let clickListener
  function addClickSelectText() {
      if (clickListener) {
          options.container.removeEventListener('click', clickListener)
      }
      clickListener = function() {
        console.log("Too!")
      }
      options.container.addEventListener('click', clickListener)
  }
  addClickSelectText()

  let sloDocument = {
    addClickSelectText: () => {
      addClickSelectText()
    }
  }

  return sloDocument
  }
})()