//Custom Viewport object that handles the view window of the app - or any app for that matter
//Purpose: To abstract away some of the functionality of the window object. Has a more optimized event handler for the window.resize

var ivectoAppMVC = ivectoAppMVC || {};
extend(ivectoAppMVC, "Viewport");
ivectoAppMVC.Viewport = function( jqEl, options ) { 

    var _hideAddressBar = (options && options.hideBar) || false; //If we want to enable the functionality for hiding the AdressBar on iPhone, etc. Default: false
    
    var orientationChangeEvent = new Event(this); //Event fires after orientationchange
    var updateChangeEvent = new Event(this); //Event fires after size update
    
    var supportsOrientationChange = "onorientationchange" in window;
    //If orientationchange is supported - run this code after event is fired - mostly relevant for iOS devices really, but maybe android also.
  
    var _onOrientationChange = function() { 
        orientationChangeEvent.notify(window.orientation);
        if (_hideAddressBar) hideAddressBar(true);
    };

    if (supportsOrientationChange){
        $(window).bind('orientationchange', _onOrientationChange);        
    };
    
    var _jqEl = jqEl;
    
    var _width = (options && options.width) || window.innerWidth || $(window).width();
    var _height = (options && options.height) || window.innerHeight || $(window).height();
    var _staticwidth = (options && options.width) ? true : false;
    var _staticheight = (options && options.height) ? true : false;
    

      
    var updateSize  = function() {      
        //Check if we have a valid object. If so - perform stuff on it!
        if ($(jqEl).length != 0){
            //$(jqEl).css('width', _staticwidth ? _width : 'inherit');
            $(jqEl).css('height', _staticheight ? _height : window.innerHeight || $( window ).height() );
            $(jqEl).css('width', _staticwidth ? _width : window.innerWidth || $( window ).width() );
        }
        updateChangeEvent.notify();

    };
    
    
    var _onScroll = function() { if ( $( window ).scrollTop() > 1 ){if (_hideAddressBar) hideAddressBar(true);} else updateSize(); } //Check for scrollTop > 1 in case we are able to scroll into the padded content or some bug on device allows us to scroll too far down

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
            updateSize();
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
    if ( !_staticheight && !_staticwidth){
            $(window).bind('resize', _onResize);
    };
    
    
    
    /* END */
    
    
    var width = function(w) { if (typeof(w) != 'undefined'){_width = w; _staticsize = true; $(_jqEl).css('width', _width); updateChangeEvent.notify(); return $(_jqEl).width(); }else{ return _width; } };
    var height = function(w) { if (typeof(w) != 'undefined'){_height = w; _staticsize = true; $(_jqEl).css('height', _height); updateChangeEvent.notify(); return $(_jqEl).height(); }else{ return _height; } };

    
    var hideAddressBar = function(bPad) {
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
            
            updateSize();
            
            if ( $(window).scrollTop() >= 1 ) setTimeout(function(){window.scrollBy(0, -1);}, 250); //If at 0,1 do this
            
        }, 250)
               
    };
    
    
    var destroy = function() { 
        $(window).unbind('resize', _onResize);
        $(window).unbind('orientationchange', _onOrientationChange);
        $(document).unbind('scroll' , _onScroll);
    }
    
    
    updateSize();
    
    return {
        divElement              :   _jqEl,
        updateChangeEvent       :   updateChangeEvent,
        orientationChangeEvent  :   orientationChangeEvent,
        width                   :   width,        
        height                  :   height,     
        destroy                 :   destroy,
        hideAddressBar          :   hideAddressBar
    };
    
};
