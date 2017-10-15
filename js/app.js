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
// get all availables tags in app
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

// list all availables tags bellow filter
var availableTagsList = document.getElementById("avaliableTags")
for(let i in allTags) {
  availableTagsList.innerHTML += `<button class="tag tag-small" title="click to add tag to filter">${allTags[i]}</button>`
}

// open clicked image on modal
var modal = document.querySelector("#modal")
var modalImg = modal.querySelector("img")
var closeModalButton = modal.querySelector("i")
var images = document.querySelectorAll("#references img")

closeModalButton.positionate = function () {

  /* align close button clossest possible (with some offset) to image's right-top corner */
  if (modal.style.display == "none") {
    return null
  }
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
for(let i in images) {
  images[i].ondblclick = function(e) {
    var img = e.target;

    modalImg.src = img.src;
    modalImg.alt = img.alt;

    modal.style.display = "";

    closeModalButton.offsetFromImg = 10;
    closeModalButton.positionate();
  }
}
modal.onclick = function (e) {
  if (e.target === modal || e.target === closeModalButton){
    modal.style.display = "none";
  }
}

// edit project name in app.
var projectName = document.querySelector("#projectName")
var storedProjectName = localStorage.getItem("projectName");

projectName.innerText = storedProjectName || projectName.innerText

addMultiEventListeners(projectName, ["contextmenu","dblclick"], function (e) {
  if (this.contentEditable !== true && this.contentEditable !== "true") {
    e.preventDefault();
    this.contentEditable = true;
    document.querySelector("header").style.marginTop = 0;
    this.focus();
    this.innerText = this.innerText;
  }
})
projectName.onkeydown = function (e) {
  if(e.keyIdentifier=='Enter'||e.keyCode==13 || e.keyIdentifier=='Tab'||e.keyCode==9){
    e.preventDefault();
    projectName.contentEditable = false;
    if(projectName.innerHTML=="!"||projectName.innerHTML==""){
      projectName.innerHTML="Project name";
      localStorage.removeItem("projectName");
    }
    return false;
  };
}
projectName.onkeyup = function (e) {
  let newName = projectName.innerHTML;
  localStorage.setItem("projectName", newName);
}
window.addEventListener("click",function(e) {
  if(e.target != projectName && projectName.contentEditable == "true"){
    projectName.contentEditable = false;
  }
})
// </ edit project name in app.

// filter references
// check if one tag list contain tags from other list
var containTag = function (imageTags, filterTags) {
  for(let i in filterTags){
    var tag = filterTags[i];
    for (let j in imageTags) {
      imageTag = imageTags[j];
      if(imageTag == tag){
        return true;
      }
    }
  }
  return false;
}
// hide references that does not have tags of the filter
function filter(filterList) {
  filterList = filterList || [];
  var target = document.querySelector("#references");
  for(var i = 0; i<target.children.length;i++){
    var item = target.children[i];
    item.style.display = "";
    var itemTags = getReferenceTags(item.querySelector("[data-tags]"));
    if (filterList.length>0 && !containTag(itemTags, filterList)){
      item.style.display = "none"
    }
  }
}
filter(window.filterTags);

for (button of document.querySelectorAll("#avaliableTags .tag")) {
  button.addEventListener("click", function (e) {
    if (e.ctrlKey) {
      window.filterTags = [];
    }
    if (window.filterTags.indexOf(this.innerText) == -1) {
      window.filterTags.push(this.innerText);
      filterTags.sort();
      filterElement.innerHTML = "";
      for (tag of window.filterTags) {
        filterElement.innerHTML += `<button class="tag tag-big">${tag}</button>`;
      }
      updateFilterTags();
      filter(window.filterTags);
      enableRemoveFilterTags();
    }
  })
  button.title = `click to add to filter
ctrl+click to also remove others`
}
var enableRemoveFilterTags = function () {

  for (button of filterElement.children) {
    button.addEventListener("click", function (e) {
      this.outerHTML = "";
      updateFilterTags();
      filter(window.filterTags);
    })
    button.title = "click to remove from filter"
  }
}
enableRemoveFilterTags();
// </ filter references

// slide aside functionality
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
swipe( modal, {
  swipeToDown: function(e, target, swipeDistance) {
    if ( Math.abs(swipeDistance) > 20) {
      target.style.display = "none";
    }
  }
});

// sroll tags list by click and move
var tagsLists = document.querySelectorAll(".tagsList")
tagsLists.forEach(function(tagsList) {
  gradScroll(tagsList);
})
