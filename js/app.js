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

// get each image's tag
function getImageTags(imgElement, wrappedIn) {
  var imgTags = imgElement.getAttribute("data-tags").split(",");
  imgTags.forEach(function(tag) {
    tag = tag.trim();
  })
  wrappedIn = wrappedIn || false
  if(wrappedIn) {
    if ( typeof(wrappedIn) !== typeof("") ){
      wrappedIn = "button";
    }
    var tagsWrapped = "";
    for (let tag in imgTags) {
      tagsWrapped += `
      <${wrappedIn} class="tag tag-small">${imgTags[tag]}</${wrappedIn}>`
    }
    return tagsWrapped
  } else {
    return imgTags
  }
}
// wrap single images in a proper HTML structure
function warpImage(imgElement) {
  var imgName = /(\w|-)+\.\w+$/.exec(imgElement.getAttribute("src"))[0];
  var imgDescription = imgElement.getAttribute("data-description") || "";
  var imgTags = getImageTags(imgElement, true);
  var imgWarp = `
    <div class="reference">
      ${imgElement.outerHTML}
      <div class="referenceInfo">
        <h3 class="title">${imgName}</h3>
        <p>${imgDescription}</p>
        <div class="referenceTags">
          <i class="tagsIcon fa fa-tags"></i>
          <div class="tagsList">
            ${imgTags}
          </div>
        </div>
      </div>
    </div>
  `;
  imgElement.outerHTML = imgWarp
  return imgWarp
}
var looseImages = document.querySelectorAll("#references>img, #references>video");
looseImages.forEach(function (img) {
  img.classList.remove("reference");
  if(img.className == "") {
    img.removeAttribute("class");
  }
  warpImage(img);
})

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
