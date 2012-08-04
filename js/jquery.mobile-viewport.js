//Custom Viewport object that handles the view window of the app - or any app for that matter
//Purpose: To abstract away some of the functionality of the window object.
/**
 * @Requires: jQuery
**/


(function ($) {
    $.fn.MobileViewport = function (options) {
        var _this = this;
        
        
        var _width = (options && options.width) || window.innerWidth || $(window).width();
        var _height = (options && options.height) || window.innerHeight || $(window).height();
        var _staticwidth = (options && options.width) ? true : false;
        var _staticheight = (options && options.height) ? true : false;
            
        var _staticsize = (_staticwidth && _staticheight);    
            
        var defaultOptions = {
            hideBar: false, //If we want to enable the functionality for hiding the AdressBar on iPhone, etc. Default: false
            width: window.innerWidth || $(window).width(),
            height: window.innerHeight || $(window).height()
        };

        var objOptions = $.extend(defaultOptions, options);


        var _onScroll = function() { if ( $( window ).scrollTop() > 1 ){if (objOptions.hideBar) _this.hideAddressBar(true);} else _this.updateSize(); } //Check for scrollTop > 1 in case we are able to scroll into the padded content or some bug on device allows us to scroll too far down

        if (!_staticheight){
            window.scrollTo( 0, 1 );
            // if defaultHomeScroll hasn't been set yet, see if scrollTop is 1
            // it should be 1 in most browsers, but android treats 1 as 0 (for hiding addr bar)
            // so if it's 1, use 0 from now on
            var _supportScrollTop = ("pageXOffset" in window || "scrollTop" in document.documentElement);
            var _defaultHomeScroll = ( !_supportScrollTop || $( window ).scrollTop() === 1 ) ? 0 : 1;
        
        
            $(document).bind('scroll', _onScroll);        
            
            /* TODO: This is not optimal to do, as click events happen all the time, and if there is a 'glitch' in the function (such as a pixel jump up and down), it can be very annoying for user.
             * So far, just using orientationchange is good enough?
            if (_hideAddressBar) $(jqEl).bind('click', function() { hideAddressBar(true); }); //Only bind this, if we have enabled _hideAddressBar
            */
        }    
        
        var supportsOrientationChange = "onorientationchange" in window;
        //If orientationchange is supported - run this code after event is fired - mostly relevant for iOS devices really, but maybe android also.
  
        var _onOrientationChange = function() { 
            _this.trigger('orientationChangeEvent');
            if (objOptions.hideBar) _this.hideAddressBar(true);
        };

        if (supportsOrientationChange){
            $(window).bind('orientationchange', _onOrientationChange);        
        };

        this.updateSize = function() {
            //Check if we have a valid object. If so - perform stuff on it!
            this.css('height', _staticheight ? objOptions.height : window.innerHeight || $( window ).height() );
            this.css('width', _staticwidth ? objOptions.width : window.innerWidth || $( window ).width() );
            this.trigger('updateChangeEvent');
        }

        this.hideAddressBar = function(bPad) {
             // Big screen. Fixed chrome likely.
            if(screen.width > 980 || screen.height > 980) return;
        
            // Standalone (full screen webapp) mode
            if(window.navigator.standalone === true) return;
        
            // Page zoom or vertical scrollbars
            if(window.innerWidth !== document.documentElement.clientWidth) {
                // Sometimes one pixel too much. Compensate.
                if((window.innerWidth - 1) !== document.documentElement.clientWidth){alert('this happened'); return;}
            }
        
            // Pad content if necessary.
            if(bPad === true && (document.documentElement.clientHeight <= window.innerHeight)) {
                // Extend body height to overflow and cause scrolling
                // Viewport height at fullscreen
                $('body').height(screen.height+200);    
            }
    
            setTimeout(function() {
               // Already scrolled?
                //if(window.pageYOffset <= 1) return;
                // Perform autoscroll
                
                //This code below almost never gets run?
                window.scrollTo(0, 1);
    
                // Reset body height and scroll
                
                $('body').height(window.innerHeight + 100);
                
                _this.updateSize();
                
                if ( $(window).scrollTop() >= 1 ) setTimeout(function(){window.scrollBy(0, -1);}, 250); //If at 0,1 do this
                
            }, 250)
                   
        };
        
                
        //This codeblock below makes sure that we don't run updateSize() on every f***ing window.resize, but only after the 'last' one of multiple in a sequence.
        //Purpose: Might save processor cycles and responsiveness
        /* START */
        var rtime = new Date(1, 1, 2000, 12,00,00);
        var timeout = false;
        var delta = 200;
       
        var resizeEnd = function() {         
            if (new Date() - rtime < delta) {
                setTimeout(resizeEnd, delta);
            } else {
                timeout = false;
                _this.updateSize();
            }  
        }; 
        
        
        var _onResize = function(arg){
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                if (!_staticheight) _height = window.innerHeight || $(window).height();
                if (!_staticwidth) _width = window.innerWidth || $(window).width();
                setTimeout(resizeEnd, delta);
            }
        };
        
        
        var _this = this;
        if ( !_staticheight || !_staticwidth){
                $(window).on('resize', _onResize);
        };
        /* END */        
        
    
        this.updateSize();
        if ( !_staticheight ) this.hideAddressBar(true);
        
        return this.each(function () {

            //var selObject = $(this);

        }); // end for each
    }; // end of functions

 })(jQuery);
