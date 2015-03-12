# jQuery.NumPad
Flexible touch-optimized numeric keypad for web applications based on jQuery. One of the best things about jQuery.NumPad is that it can easily fit into most UI frameworks using jQuery by merely setting a few templates! The numeric keypad can be used input fields, password fields, general div-elements or entire table columns.

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
	$('selector').numpad();
}
```

## TODOs
- Add support for negative numbers
- Add support for fractions
- Add position options to place the keypad above or aside the target element
- Add an onClose callback to support custom target elements
- Make a simple calculator

## License
jQuery.NumPad is an open source project by [Andrej Kabachnik](http://a.kabachnik.info), that is licensed under [MIT](http://opensource.org/licenses/MIT).