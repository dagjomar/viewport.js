/* qCallbacks.js 
 * ---------------
 * by: Dag Jomar Mersland
 *
 * Purpose: an object to handle the notifications of custom Events. Has an array with a stack for each Event 'name'. 
 * Requires: custom Event.js
 * Usage example: 
 
        //Define an event
        var myEvent = new Event(this);
        
        //Attach a function to the event
        myEvent.attach( function(caller, args) { qCallbacks.push('myEventNameString', args); } );  //The attached function pushes the arguments into the qCallback object
        
        //When the Event notifies listeners, the callbackfunction is run.
        myEvent.notify( 42 );
        
        //Now we can test the number of callbacks made from any event      
        var numNotify = qCallbacks.count('myEventNameString'); // returns 1
        var lastArgs = qCallbacks.lastarg('myEventNameString'); // returns 42
        
 */
 
var qCallbacks = function() { 
        var _stack = {};
        
        var push = function(name, args) { 
            if ( typeof(_stack[name]) == 'undefined' ) _stack[name] = [];     
            _stack[name].push(args);
        };
        
        var count = function(name) { if ( typeof(_stack[name]) != 'undefined') return _stack[name].length; else return 0; };
        
        var getLastArg = function(name) { if ( typeof(_stack[name]) != 'undefined') return _stack[name][_stack[name].length-1]; else return; };
        
        var reset = function() { _stack = {} };
        
        return {
            push: push,
            count : count,
            lastarg : getLastArg,
            _stack : _stack,
            reset : reset
        }
} ();