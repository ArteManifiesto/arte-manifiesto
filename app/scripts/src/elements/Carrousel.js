/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
APP.Carrousel = function(view, container) {
  this.view = view;
  this.container = container;
  this.nextBtn = this.view.find('.nextButton');
  this.prevBtn = this.view.find('.prevButton');
  this.carrousel = this.view.find('.more-images');
  this.setup();
};

APP.Carrousel.constructor = APP.Carrousel;

APP.Carrousel.prototype.checkArrows = function() {
  clearTimeout(this.timeout);

  if (this.container[0].scrollWidth > this.container.innerWidth()) {
    this.nextBtn.show();
    this.prevBtn.show();
  } else {
    this.nextBtn.hide();
    this.prevBtn.hide();
  }

  this.animationComplete();
};

APP.Carrousel.prototype.setup = function() {
  this.nextBtn.click(this.nextHandler.bind(this));
  this.prevBtn.click(this.prevHandler.bind(this));

  this.carrousel.scroll(this.animationComplete.bind(this));

  $(window).resize(this.checkArrows.bind(this));

  this.timeout = setTimeout(this.checkArrows.bind(this), 1000);
};

APP.Carrousel.prototype.nextHandler = function() {
  this.carrousel.animate({
    scrollLeft: (this.carrousel.scrollLeft() + 230)
  }, 400, this.animationComplete.bind(this));
};

APP.Carrousel.prototype.prevHandler = function() {
  this.carrousel.animate({
    scrollLeft: (this.carrousel.scrollLeft() - 230)
  }, 400, this.animationComplete.bind(this));
};

APP.Carrousel.prototype.animationComplete = function() {
  if (this.carrousel.scrollLeft() <= 0)
    this.prevBtn.hide();
  else
    this.prevBtn.show();

  var totalWidth = this.carrousel.scrollLeft() + this.carrousel.innerWidth();

  if (totalWidth >= this.carrousel[0].scrollWidth)
    this.nextBtn.hide();
  else
    this.nextBtn.show();
};