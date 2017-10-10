/* var curYPos, curXPos, curDown;

window.addEventListener('mousemove', function(e){
if(curDown){
  window.scrollTo( document.body.scrollLeft + (curXPos - e.pageX), document.body.scrollTop + (curYPos - e.pageY) );
}
});

window.addEventListener('mousedown', function(e){
  curYPos = e.pageY;
  curXPos = e.pageX;
  curDown = true;
});

window.addEventListener('mouseup', function(e){
  curDown = false;
}); */
// BUG: the cursor gets weard when cursor passes between the tag list and its tags itens. If scroll start on tag list, and cursor passes over a tag, the scroll go to te end, if the inverse, scroll goes to the start
function gradScroll(targetObj) {
  targetObj = targetObj || window;

  targetObj.addEventListener('mousedown', function(e){
    isTargetWindow = (targetObj === window);

    targetObj.cursorXPos = (isTargetWindow)? e.x:e.layerX;
    targetObj.cursorYPos = (isTargetWindow)? e.y:e.layerY;
    targetObj.cursorDown = true;

    targetObj.originalScrollLeft = targetObj.scrollLeft
    targetObj.originalScrollTop = targetObj.scrollTop
  });

  targetObj.addEventListener('mouseup', function(e){
    targetObj.cursorDown = false;
  });

  targetObj.addEventListener('mouseleave', function(e){
    targetObj.cursorDown = false;
  });

  targetObj.addEventListener('mousemove', function(e){
    if (targetObj.cursorDown){
      targetObj.scrollLeft += (targetObj.cursorXPos - e.layerX)
      targetObj.scrollTop += (targetObj.cursorYPos - e.layerY)

      if(e.target === targetObj) {
        targetObj.cursorXPos = e.layerX;
        targetObj.cursorYPos = e.layerY;
      }
    }
  });
}

/* Based on Click and Drag to Scroll script from Josh Parret in CodePen: https://codepen.io/JTParrett/pen/rkofB*/
