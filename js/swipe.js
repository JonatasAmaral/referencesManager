var swipe = function (target, actions, includeChildren) {
  target =  target || document;
  if (actions === null) {
    /* do nothing */
    actions = {}
  } else if(!actions) {
    console.error(`swipe(actions, target) must have an action object with at least one function, folowing the sintax:\n\t{
      \t wipeToRight  : function () {},
      \t wipeToLeft   : function () {},
      \t swipeToUp    : function () {},
      \t swipeToDown  : function () {}
    }
    or a "null" value to disable all swipes (but not removing the event listeners already added)`);
    return null;
  }
  includeChildren = includeChildren || true;

  actions.swipeToRight = actions.swipeToRight || function(){return null}
  actions.swipeToLeft = actions.swipeToLeft || function(){return null}
  actions.swipeToUp = actions.swipeToUp || function(){return null}
  actions.swipeToDown = actions.swipeToDown || function(){return null}

  var xDown = null;
  var yDown = null;

  target.handleTouchStart = function (evt) {
    // window.getComputedStyle(evt.target);
    if (!includeChildren && target!=evt.target) {
      return null;
    }
    for (element of evt.path) {
      if (element.scrollWidth > 15 + parseInt(window.getComputedStyle(element).width)) {
        return null;
      }
      if (element == document.body) {
        break;
      }
    }

    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  };

  target.handleTouchMove = function (evt) {
    if (!includeChildren && target!=evt.target) {
      return null;
    }
    if ( !xDown || !yDown ) {
      return null;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
      if ( xDiff > 0 ) {
        /* left swipe */
        actions.swipeToLeft(evt, target, xDiff);
      } else {
        /* right swipe */
        actions.swipeToRight(evt, target, xDiff);
      }
    } else {
      if ( yDiff > 0 ) {
        /* up swipe */
        actions.swipeToUp(evt, target, yDiff);
      } else {
        /* down swipe */
        actions.swipeToDown(evt, target, yDiff);
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };

  target.addEventListener('touchstart', target.handleTouchStart, false);
  target.addEventListener('touchmove', target.handleTouchMove, false);
}

swipe.removeAll = function (target) {
  if(!target) {
    console.error(`swipe.remove(target) must have an target HTML object`);
    return null;
  }
  target.removeEventListener('touchstart', target.handleTouchStart, false);
  target.removeEventListener('touchmove', target.handleTouchMove, false);

}

/* adapted from script by givanse on stackoverflow: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android#answer-23230280*/
