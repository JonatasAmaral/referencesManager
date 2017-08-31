/* needs jQuery */

$(document).ready(function () {
  var swipeTarget = document.querySelector("#page");
  var swipeFilterOnMobile = function () {
    swipe({
      swipeToRight: function() {
        let checkbox = document.querySelector("#filtersTrigger");
        checkbox.checked = true;
        pristine.remove(checkbox)
      },
      swipeToLeft: function() {
        let checkbox = document.querySelector("#filtersTrigger");
        checkbox.checked = false;
      }
    }, swipeTarget )
  }

  swipeFilterOnMobile();

  $(window).resize(function () {
    if(window.matchMedia( "(max-width: 650px)" ).matches) {
      swipeFilterOnMobile();
    } else {
      swipeTarget;
    }
  })
});
