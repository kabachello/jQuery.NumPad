# jQuery.NumPad
Flexible touch-optimized numeric keypad for web applications based on jQuery. One of the best things about jQuery.NumPad is that it can easily fit into most UI frameworks using jQuery by merely setting a few templates! The numeric keypad can be used to fill inputs, password fields, general div-elements or entire table columns.

## Demos
- With jQuery mobile: http://a.kabachnik.info/numeric-keypad-for-jquery-mobile.html
- With Bootstrap: coming soon!
- Stand alone: coming soon!

## Quick start

1) Include the plugin and the CSS in your header

```html
<link rel="stylesheet" href="path_to_numpad_folder/jquery.numpad.css">
<script type="text/javascript" src="path_to_numpad_folder/jquery.numpad.js"></script>
```

2) Initialize numpads for every element you want to toggle a numeric keypad

```javascript
function($){
	$('selector1').numpad();
}
```

## Options
Options can be set for every numpad by passing an object argument to numpad()
```javascript
$('selector2').numpad({optionName: optionValue});
```

Default options for an entire page can be specified via
```javascript
$.fn.numpad.defaults.optionName = optionValue;
```  
### General options
- target (default: false) - a jQuery element, to put the input from the keypad to. If set to false, the element, on which numpad() is called, will be used.
- openOnEvent (default: 'click') - name of the event to trigger opening the numpad.
- appendKeypadTo (default: false) - the jQuery elemnt, that the keypad should be appended to. If set to false, $(document) will be used.
- position (default: 'fixed') - position of the keypad. Fixed position can be defined by setting positionX and positionY.
- positionX (default: 'center') - horizontal position of the keypad relative to the visible window. Possible values: left, right, center or a integer value
- positionY (default: 'middle') - vertical position of the keypad relative to the visible window. Possible values: top, bottom, middle or an integer value.

### Templates
- backgroundTpl (default: '<div></div>') - Template for the background overlay behind the Keypad
- gridTpl (default: '<table></table>') - Template for the keypad grid
- displayTpl (default: '<input type="number" />') - Template for the display field above the keypad
- displayCellTpl (default: '<td colspan="4"></td>') - Template for the grid cell, where the display field is located
- rowTpl (default: '<tr></tr>') - Template for each row of the grid
- cellTpl (default: '<td></td>') - Template for each regular cell of the grid
- buttonNumberTpl (default: '<button></button>') - Template for the number buttons
- buttonFunctionTpl (default: '<button></button>') - Template for the functional buttons (like clear, done, etc.)

### Translations
- textDone (default: 'Done') - Text of the done button
- textDelete (default: 'Del') - Text of the delete or backspace button
- textClear (default: 'Clear') - Text of the clear button
- textCancel (default: 'Cancel') - Text of the cancel button

### Events and callbacks
- onKeypadCreate (default: false) - Callback function, that is called once a numpad is created - right after initialization. Using this callback the keypad can be customized by regular javascript. The event is dispatched once for each keypad. It is not dispatched when the keypad is shown!

## TODOs
- Add support for negative numbers
- Add support for fractions
- Add position options to place the keypad above or aside the target element
- Add an onClose callback to support custom target elements
- Add an onOpen callback to support custom initial values
- Make a simple calculator

## License
jQuery.NumPad is an open source project by [Andrej Kabachnik](http://a.kabachnik.info), that is licensed under [MIT](http://opensource.org/licenses/MIT).