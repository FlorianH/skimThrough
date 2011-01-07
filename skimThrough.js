(function( $ ){


  // "imagesLoaded" by Paul Irish (https://github.com/paulirish)
  // https://gist.github.com/268257
  // $('img.photo',this).imagesLoaded(myFunction)
  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // mit license. paul irish. 2010.
  // webkit fix from Oren Solomianik. thx!

  // callback function is passed the last image to load
  //   as an argument, and the collection as `this`

  $.fn.imagesLoaded = function(callback){
    var elems = this.filter('img'),
        len   = elems.length;

    elems.bind('load',function(){
        if (--len <= 0){ callback.call(elems,this); }
    }).each(function(){
       // cached images don't fire load sometimes, so we reset src.
       if (this.complete || this.complete === undefined){
          var src = this.src;
          // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
          // data uri bypasses webkit log warning (thx doug jones)
          this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
          this.src = src;
       }
    });

    return this;
  };



  $.fn.skimThrough = function(options) {

    var container       = this,
        fade_duration   = (options && options.duration) ? options.duration : 500,
        counter_element = (options && options.counter_element) ? options.counter_element : false,
        images          = this.children('img'),
        num_images      = images.length,
        part_size       = $(window).width() / num_images,
        displayed_part  = false;


    function mouseMoved(e)
    {
      var mouseX            = (e.pageX) ? e.pageX : 0,
          current_part      = Math.min( (num_images-1), Math.floor( mouseX / part_size )),
          must_update_view  = (current_part !== displayed_part);

      if (must_update_view)
      {
        var old_image = images[displayed_part],
            new_image = images[current_part];

        images.css('z-index', '-3')
        $(old_image).css('z-index', '-2')
        $(new_image).hide().css('z-index', '-1').stop(true, true).fadeIn(fade_duration);

        displayed_part = current_part;

        if (counter_element && $(counter_element))
          $(counter_element).html( (displayed_part+1) + '/' + num_images);
      }
    }


    function windowResized(e)
    {
      var window_ratio  = $(window).width() / $(window).height();
      part_size = $(window).width() / num_images;

      images.each(function()
      {
        var image_ratio   = $(this).width() / $(this).height(),
            ratioclass    = (window_ratio < image_ratio) ? 'bgheight' : 'bgwidth';
            
        $(this).removeClass().addClass(ratioclass).addClass('bg');

      });
    }



    // While loading:
    container.hide();

    /**
     * After all images are loaded:
     *  - initialize the event listeners
     *  - display the container
     */
    $('img', container).imagesLoaded(function() {

      $(document).mousemove(mouseMoved).trigger("mousemove");
      $(window).resize(windowResized).trigger("resize");

      container.show();
    });

  };
})( jQuery );