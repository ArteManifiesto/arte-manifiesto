function Slider(el, data) {

  var slides = el.querySelectorAll('.' + data.slideClass)
  var sliderNavItems = el.querySelectorAll('.' + data.sliderNavItemClass)

  var pos = 0

  var hammertime = new Hammer(el);
  var interval = setInterval(next, 10000)
  function setup() {

    hammertime.on('swipeleft', function() {
      clearInterval(interval)
      interval = setInterval(next, 5000)
      next()
    });

    hammertime.on('swiperight', function() {
      clearInterval(interval)
      interval = setInterval(next, 5000)
      prev()
    });

    for (var i = 0; i < sliderNavItems.length; i++)
      sliderNavItems[i].setAttribute('index', i)

    for (var i = 0; i < sliderNavItems.length; i++)
      sliderNavItems[i].addEventListener('click', function() {
        clearInterval(interval)
        interval = setInterval(next, 5000)
        move(parseInt(this.getAttribute('index')))
      })
  }

  function next() {
    if (pos == slides.length - 1) return
    move(pos + 1)
  }

  function prev() {
    if (pos == 0) return
    move(pos - 1)
  }

  function move(newPos) {

    for (var i = 0; i < slides.length; i++) {
      var style = slides[i].style
      style.webkitTransform = 'translate(' + newPos * -100 + '%,0)' + 'translateZ(0)'
      style.msTransform =
        style.MozTransform =
        style.OTransform = 'translateX(' + newPos * -100 + '%)'
    }

    sliderNavItems[pos].classList.remove('active')
    pos = newPos
    sliderNavItems[pos].classList.add('active')
  }

  setup()
}
