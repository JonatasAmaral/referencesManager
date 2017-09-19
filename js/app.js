var pristine = function (input) {
  return input.hasAttribute("data-pristine");
}
pristine.remove = function (input) {
  if (pristine(input)) {
    input.removeAttribute("data-pristine");
  }
}
pristine.makePristine = function (input) {
  if ( !pristine(input)) {
    input.setAttribute("data-pristine", "");
  }
}

// open clicked image on modal
var modal = document.querySelector("#modal")
var modalImg = modal.querySelector("img")
var closeModalButton = modal.querySelector("i")
var images = document.querySelectorAll("#references img")

for(let i in images) {
  images[i].ondblclick = function(e) {
    var img = e.target;

    modalImg.src = img.src;
    modalImg.alt = img.alt;

    modal.style.display = "";

    closeModalButton.offsetFromImg = 10;

    /* align close button clossest possible (with some offset) to image's right-top corner */
    closeModalButton.style.top =  (modalImg.offsetTop - closeModalButton.clientHeight) - closeModalButton.offsetFromImg + "px";
    closeModalButton.style.right =  (modalImg.offsetLeft - closeModalButton.clientWidth) - closeModalButton.offsetFromImg + "px"

    if(parseInt(closeModalButton.style.top) < 20){
      closeModalButton.style.top = "20px";
    }
    if(parseInt(closeModalButton.style.right) < 20){
      closeModalButton.style.right = "20px";
    }
    /* </ align close button */
  }
}
modal.onclick = function (e) {
  if (e.target === modal || e.target === closeModalButton){
    modal.style.display = "none";
  }
}

// slide aside functionality
// BUG: side bar is being swiped when scrolling through tags list
// TODO: make the swipe a "realtime" thing
var swipeTarget = document.querySelector("#page");
var swipeFilterOnMobile = function () {
  swipe( swipeTarget, {
      swipeToRight: function() {
        let checkbox = document.querySelector("#filtersTrigger");
        checkbox.checked = true;
        pristine.remove(checkbox);
      },
      swipeToLeft: function() {
        let checkbox = document.querySelector("#filtersTrigger");
        checkbox.checked = false;
      }
    }
  )
}
swipeFilterOnMobile();
window.onresize = function () {
  if(window.width < 650) {
    swipeFilterOnMobile();
  } else {
    swipeTarget;
  }
}

// edit project name in app. Prompt way
var projetcName = document.querySelector("#projetcName")
var storedProjectName = localStorage.getItem("projetcName");
if(storedProjectName){projetcName.innerText = storedProjectName}
projetcName.ondblclick = function () {
  let newName = prompt(`Name of project ("!" to clear)`);
  if(newName == "!") {
    newName = "Project name";
    localStorage.removeItem("projetcName");
  } else {
    localStorage.setItem("projetcName", newName);
  }
  this.innerHTML = newName;
}
