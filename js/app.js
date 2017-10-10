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
function addMultiEventListeners(target, events, func) {
  if (typeof(events) == typeof("string")) {
    events = [events];
  }
  for (eventQuery of events) {
    target.addEventListener(eventQuery, func);
  }
}

var filterElement = document.querySelector("#filter");
window.filterTags = [];

// get all filter tags
function updateFilterTags() {
  window.filterTags = [];
  for (button of filterElement.children) {
    window.filterTags.push(button.innerText);
  }
}
updateFilterTags();
// get each image's tag
function getReferenceTags(referenceElement, wrappedIn) {
  if(referenceElement){
    var imgTags = referenceElement.getAttribute("data-tags") || "";
    imgTags = imgTags.split(",")
    for(var i = 0; i < imgTags.length; i++) {
      imgTags[i] = imgTags[i].trim();
      if (imgTags[i].length==0) {
        imgTags.splice(i, 1);
        i--;
      }
    }

    wrappedIn = wrappedIn || false
    if(wrappedIn) {
      if ( typeof(wrappedIn) !== typeof("") ){
        wrappedIn = "button";
      }
      var tagsWrapped = "";
      for (tag of imgTags) {
        tagsWrapped += `<${wrappedIn} class="tag tag-small">${tag}</${wrappedIn}>`
      }
      return tagsWrapped
    } else {
      return imgTags
    }
  } else {
    return null;
  }
}
// wrap single images in a proper HTML structure
function warpReference(referenceElement) {
  var imgName = /(\w|-)+\.\w+$/.exec(referenceElement.getAttribute("src"))[0];
  var imgDescription = referenceElement.getAttribute("data-description") || "";
  var imgTags = getReferenceTags(referenceElement, true);
  var imgWarp = `
    <div class="reference">
      ${referenceElement.outerHTML}
      <div class="referenceInfo">
        <h3 class="title">${imgName}</h3>
        <p>${imgDescription}</p>
        <div class="referenceTags" ${imgTags.length==0? 'style="display:none"': ''}>
          <i class="tagsIcon fa fa-tags"></i>
          <div class="tagsList">
            ${imgTags}
          </div>
        </div>
      </div>
    </div>
  `;
  referenceElement.outerHTML = imgWarp
  return imgWarp
}
var looseImages = document.querySelectorAll("#references>img, #references>video");
looseImages.forEach(function (img) {
  img.classList.remove("reference");
  if(img.className == "") {
    img.removeAttribute("class");
  }
  warpReference(img);
})
// get all avaiables tags in app
var taggedReferences = document.querySelectorAll("[data-tags]");
var allTags = [];
for(var i = 0; i < taggedReferences.length; i++) {
  var tags = getReferenceTags(taggedReferences[i]);
  for( tag of tags){
    if (allTags.indexOf(tag)==-1) {
      allTags.push(tag);
    }
  }
}
allTags.sort()

// list all avaiables tags bellow filter
var avaiableTagsList = document.getElementById("avaliableTags")
for(let i in allTags) {
  avaiableTagsList.innerHTML += `<button class="tag tag-small" title="click to add tag to filter">${allTags[i]}</button>`
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
    closeModalButton.positionate = function () {

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
    closeModalButton.positionate();
  }
}
modal.onclick = function (e) {
  if (e.target === modal || e.target === closeModalButton){
    modal.style.display = "none";
  }
}

// slide aside functionality
// BUG: side bar is being swiped when scrolling through tags list
// TODO: make the swipe "realtime"
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
    },
  false);
}
swipeFilterOnMobile();
window.onresize = function () {
  if(window.innerWidth < 650) {
    swipeFilterOnMobile();
  } else {
    swipe.removeAll(swipeTarget);
  }

  closeModalButton.positionate();
}
