# jQuery.NumPad
Flexible touch-optimized numeric keypad for web applications based on jQuery

## Demos
With jQuery mobile: http://a.kabachnik.info/numeric-keypad-for-jquery-mobile.html

With Bootstra: coming soon!

## Quick start
1. Include the plugin and the CSS in your header

```html
<link rel="stylesheet" href="path_to_numpad_folder/jquery.numpad.css">
<script type="text/javascript" src="path_to_numpad_folder/jquery.numpad.js"></script>
```

2. Initialize numpads for every element you want to toggle a numeric keypad

```javascript
function($){
	$('selector').numpad();
}
```