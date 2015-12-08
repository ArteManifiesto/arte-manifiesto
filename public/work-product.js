$(document).ready(function() {
  function Carousel (el , container) {
  	var nextButton = el.querySelector('.nextButton'),
  			prevButton = el.querySelector('.prevButton'),
  			carousel = el.querySelector('.more-images'),
  			interval;


  			var checkArrows = function () {
  				clearTimeout(timeout);
  				if (container[0].scrollWidth > $(container).innerWidth()) {
  						$(nextButton).show();
  						$(prevButton).show();
  	        } else {
  						$(nextButton).hide();
  						$(prevButton).hide();
  	        }
  			}
  			var timeout = setTimeout(function() {
  				checkArrows();
  				$(carousel).scroll();
  			},1000);


  	function setup () {
  		var completeAnimation = function () {
  			if(this.scrollLeft <=0 ) {
  				$(prevButton).hide();
  			}else {
  				$(prevButton).show();
  			}
  			console.log(this.scrollLeft , this.scrollLeft + $(this).innerWidth())
  			if(this.scrollLeft +  $(this).innerWidth() >= this.scrollWidth) {
  				$(nextButton).hide();
  			}else {
  				$(nextButton).show();
  			}
  		}
  		$(nextButton).click(function () {
  				$(carousel).animate({
  					scrollLeft: (carousel.scrollLeft + 230)
  				},400, completeAnimation);
  		});

  		$(prevButton).click(function () {
  			$(carousel).animate({
  				scrollLeft: (carousel.scrollLeft - 230)
  			},400,completeAnimation);
  		});
  		$(carousel).scroll(completeAnimation);
  		$( window ).resize(checkArrows);
  	}
  	setup()
  }
  var carousel = new Carousel (document.querySelector('.js-more-carousel') , $('.more'));
  var carousel = new Carousel (document.querySelector('.js-similar-carousel'), $('.similar'));


  var meta;
  var zoom = false;
  var loadImage = 'default'


  setTimeout(function () {

    $('#work-image').click(function () {

      if( !zoom ) {

        $('#go-preload-modal').trigger( "click" );

        loadImage = 'loading'

  			$("<img/>").load(function() {

          loadImage = 'load'

          $('#lean_overlay').trigger( "click" );

          var width = this.width, height = this.height;
          meta = { width: width, height: height }

          document.getElementById('work-image').onclick = openPhotoSwipe;

          $('#work-image').trigger( "click" );

        }).attr("src", Utils.addImageFilter(work.photo, 'w_1500,h_800,c_limit,q_80'));

        zoom = true

  		} else {
        console.log(loadImage)
        if( loadImage == 'loading' ) {
          $('#go-preload-modal').trigger( "click" );
        }
      }
  	})

  }, 3000)

  var openPhotoSwipe = function() {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var items = [
  		{
  			src: Utils.addImageFilter(work.photo, 'w_1500,h_800,c_limit,q_80'),
  			w: meta.width,
  			h: meta.height
  		}
    ];
    var options = {
    	getThumbBoundsFn: function () {
    		return {
    			x: $('#work-image')[0].offsetLeft ,y: $('#work-image')[0].offsetTop + 50, w: $('#work-image')[0].width}
    	}
    };
    window.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };
});
