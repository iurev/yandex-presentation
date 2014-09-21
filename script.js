/*global  $*/
(function($) {
  $(function() {
    var isPresentationActive = false;
    var activeSlide = {
      $dom: null,
      index: null
    };

    var $slides = $(".slides .slide");

    (function initialize() {
      $slides.each(function(index, slide) {
        $(slide).data("index", index);
      }).click(function() {
        openSlide(this);
      });

      var $title = $(".slides > h1:first-child");
      if ($title) {
        document.title = $title.text();
      }
    })();

    var toggleFullView = (function() {
      var $slidesList = $(".slides");
      return function() {
        if (!isPresentationActive) {
          $slidesList.addClass("fullscreen").removeClass("preview");
          $slides.hide();
          isPresentationActive = true;
        } else {
          $slidesList.addClass("preview").removeClass("fullscreen");
          $slides.show();
          isPresentationActive = false;
        }
      };
    })();


    var openSlide = function(slide) {
      if (isPresentationActive) return;

      toggleFullView();
      activeSlide.$dom = $(slide).fadeIn();
      activeSlide.index = activeSlide.$dom.data("index");
    };

    var nextSlide = function() {
      if ((activeSlide.index > ($slides.length - 2)) || !isPresentationActive) {
        return;
      }

      activeSlide.index++;
      activeSlide.$dom.hide();
      activeSlide.$dom = $($slides[activeSlide.index]).fadeIn();
    };

    var toPreview = function() {
      if (isPresentationActive) {
        toggleFullView();
        activeSlide = {
          $dom: null,
          index: null
        };
      }
    };

    var prevSlide = function() {
      if ((activeSlide.index === 0) || !isPresentationActive) {
        return;
      }

      activeSlide.index--;
      activeSlide.$dom.hide();
      activeSlide.$dom = $($slides[activeSlide.index]).fadeIn();
    };

    $(document).keydown(function(e) {
      console.log(e.which);
      switch (e.which) {
        case 39:
          nextSlide();
          break; //right
        case 37:
          prevSlide();
          break; //left
        case 27:
          toPreview();
          break; //esc
      }
    });

  });
})($);
