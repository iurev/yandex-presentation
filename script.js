/*global  $*/
(function($) {
  $(function() {
    'use strict';

    var Presentations = function() {
      var counter = 1;
      var presentations = [];
      var $tableOfContents = $(".titles");

      this.download = function() {
        var that = this;

        $.ajax('presentations/p' + counter + '.html')
          .success(function(page) {
            presentations.push(page);
            counter++;
            that.download();
          }).error(that.createTableOfContents);

        return this;
      };

      this.createTableOfContents = function() {
        var presentationsTitles = [];

        presentationsTitles = presentations.map(function(page, index) {
          var $page = $(page);
          var title = $page[0];
          var title_text;
          if ((title.className === "title") &&
            (title.tagName === "H1")) {
            title_text = title.innerText;
          } else {
            title_text = 'Без названия ' + index;
          }

          return "<h3 data-index='" + index + "'>" + title_text + "</h3>";
        }).join('');

        $tableOfContents.html(presentationsTitles).click(this.openPresentation);

        return this;
      };

      this.openPresentation = function(event) {
        var index = $(event.target).data("index");
        stateMachine.openPresentation(presentations[index]);
      };
    };

    var Slides = function() {
      var $slidesList = $(".slides");
      var $slides = null;
      var activeSlide = {
        $dom: null,
        index: null
      };

      this.init = function(presentation) {
        $(".slides").html(presentation);
        $slides = $(".slides > .slide");
        $slides.click(this.openSlide);

        $slides.each(function(index, slide) {
          $(slide).data("index", index);
        });
        return this;
      };
      this.nextSlide = function() {
        if (activeSlide.index > ($slides.length - 2)) return;

        activeSlide.index++;
        activeSlide.$dom.hide();
        activeSlide.$dom = $($slides[activeSlide.index]).fadeIn();
      };
      this.prevSlide = function() {
        if (activeSlide.index === 0) return;

        activeSlide.index--;
        activeSlide.$dom.hide();
        activeSlide.$dom = $($slides[activeSlide.index]).fadeIn();
      };
      this.openSlide = function() {
        stateMachine.openSlide(this);
        activeSlide.$dom = $(this).fadeIn();
        activeSlide.index = activeSlide.$dom.data("index");
        return this;
      };
      this.hideAllSlides = function() {
        $slides.hide();
        return this;
      };
      this.showAllSlides = function() {
        $slides.show();
        return this;
      };
    };

    var StateMachine = function() {
      var presentations = new Presentations().download().createTableOfContents();
      var slides = new Slides();
      var $app = $('.app');

      // avaliable states: contents, presentation, slide
      this.state = 'contents';

      this.openContents = function() {
        if (this.state !== 'contents') {
          this.state = 'contents';
        }
        $app.addClass('contents').removeClass('slide-view presentation');

        return this;
      };

      this.openPresentation = function(presentation) {
        if (this.state !== 'presentation') {
          this.state = 'presentation';
          $app.addClass('presentation').removeClass('slide-view contents');
          if (arguments.length) {
            slides.init(presentation);
          }
          slides.showAllSlides();
        }

        var $title = $(".slides > h1.title").text();
        if ($title) {
          document.title = $title;
        }
        return this;
      };

      this.openSlide = function(slide) {
        if (this.state !== 'slide') {
          this.state = 'slide';
          $app.addClass('slide-view').removeClass('presentation contents');
          slides.hideAllSlides().openSlide(slide);
        }
      };

      this.slideActions = function(action) {
        if (this.state !== 'slide') return;
        slides[action]();
      };

      this.back = function() {
        switch (this.state) {
          case 'slide':
            this.openPresentation();
            break;
          case 'presentation':
            this.openContents();
            break;
        }
      };

      this.init = function() {
        var that = this;
        $(document).keydown(function(e) {
          switch (e.which) {
            case 39:
              that.slideActions('nextSlide');
              break; //right
            case 37:
              that.slideActions('prevSlide');
              break; //left
            case 27:
              that.back();
              break; //esc
          }
        });
        return this;
      };
    };

    var stateMachine = new StateMachine().init().openContents();
  });
})($);
