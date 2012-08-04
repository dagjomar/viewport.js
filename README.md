viewport.js
===========

The flexible mobile adaptable fullscreen viewport

Abstract
--------
This jQuery plugin makes a div able to adjust to the available, visible screen space on most devices.
It responds to scroll, resize and orientation changes.

Intro
-----
Sometimes, when designing/developing a cross-platform web app - 
you might want the app to only use the available screen space, 
so that all the controls are visible at any give time. 

Some solutions make use of CSS 100% width and height for the main wrapper div - 
but that is not enough to account for weird stuff happening when - for instance - 
you scroll the page on the iPhone, or make the address-bar visible.

Solution
--------
By putting different solutions together, this plugin tries to solve the problem, where part
of the application might end up off-screen due to scrolling, or address-bar, etc...