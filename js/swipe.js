var swipe = function (actions, target) {

  if (actions === null) {
    /* do nothing */
    actions = {}
  } else if(!actions) {
    console.error(`swipe(actions, target) must have an action object with at least one function, folowing the sintax:\n\t{
      \t wipeToRight : function () {},
      \t wipeToLeft  : function () {},
      \t swipeToUp    : function () {},
      \t swipeToDown  : function () {}
    }
    or a "null" value to sisable it`);
    return null;
  }


  actions.swipeToRight = actions.swipeToRight || function(){return null}
  actions.swipeToLeft = actions.swipeToLeft || function(){return null}
  actions.swipeToUp = actions.swipeToUp || function(){return null}
  actions.swipeToDown = actions.swipeToDown || function(){return null}

  target =  target || document;

  target.addEventListener('touchstart', handleTouchStart, false);
  target.addEventListener('touchmove', handleTouchMove, false);

  var xDown = null;
  var yDown = null;

  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  };

  function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
      if ( xDiff > 0 ) {
        /* left swipe */
        actions.swipeToLeft();
      } else {
        /* right swipe */
        actions.swipeToRight();
      }
    } else {
      if ( yDiff > 0 ) {
        /* up swipe */
        actions.swipeToUp();
      } else {
        /* down swipe */
        actions.swipeToDown();
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };
}

swipe.remove = function (target) {
  if(!target) {
    console.error(`swipe.remove(target) must have an target HTML object`);
    return null;
  }
  target.removeEventListener('touchstart');
  target.removeEventListener('touchmove');

}

/* adapted from script by givanse on stackoverflow: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android#answer-23230280*/
