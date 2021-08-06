/*
	This file was forked from https://github.com/kabachello/jQuery.NumPad
		with the license shown below.
   
	This license only applies to this file and others from the same project, which
	also are prefixed with this header.  This file may have been modified, but the
	license still applies.

	----------------------------------------------------------------------------------
   
	The MIT License (MIT)

	Copyright (c) 2014-2015 almasaeed2010

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * jQuery.NumPad
 *
 * Copyright (c) 2015 Andrej Kabachnik
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 * https://github.com/kabachello/jQuery.NumPad
 *
 * Version: 1.4
 *
 */
(function ($) {
	$.fn.numpad = function (options){
		if (typeof options === 'string') {
			let numberPadElement = $.data(this[0], 'numpad');

			if (!numberPadElement) {
				throw "Cannot perform '" + options + "' on a numpad prior to initialization!";
			}

			numberPadElement._numpad_processOptionsArgAsCommand(options, this.first());

			return this;
		}

		// Apply the specified options overriding the defaults
		options = $.extend({}, JQueryNumpad.defaults, options);

		// Create a numpad. One for all elements in this jQuery selector.
		// Since numpad() can be called on multiple elements on one page, each call will create a unique numpad id.
		let id = 'nmpd' + ($('.nmpd-wrapper').length + 1);
		let numberPadElement = {};

		// "this" is a jQuery selecton, which might contain many matches.
		return this.each(function (_, numpadTarget) {
			if ($('#' + id).length === 0) {
				numberPadElement = new JQueryNumpad(options, id);
			}

			$.data(numpadTarget, 'numpad', numberPadElement);

			$(numpadTarget).attr("readonly", true).attr('data-numpad', id).addClass('nmpd-target');

			$(numpadTarget).bind(options.openOnEvent, function () {
				numberPadElement.numpad_open(options.target
					? options.target
					: $(numpadTarget));
			});
		});
	};
})(jQuery);


/**
 * non-static functions and methods will be merged in with existing functions on any jquery object this is used to extend
 * conflicting names may be overwritten
 * many of these functions are written as if the constructed object is merged with a jquery object (using find() and such)
 * */
class JQueryNumpad {
	constructor(options, id) {
		this.options = options;
		this.numpad_id = id;
		
		let numberPadElement = this._numpad_constructNewNumberPadElement(id, options);
		
		$.extend(this, numberPadElement);
		
		this._numpad_initialize();
	}

	_numpad_initialize = () => {
		this._numpad_showOrHideButtons();
		this._numpad_registerEvents();
		this._numpad_appendToTarget();

		$('#' + this.numpad_id + ' .numero').bind('click', this._numpad_handleCharacterButtonClick);

		this.trigger('numpad.create');
    }
	
	numpad_display = {};

	_numpad_handleCharacterButtonClick = (event) => {
		let newText = $('#' + this.numpad_id + ' .dirty').val() === '0'
			? $(event.target).text()
			: this.numpad_display.val().toString() + $(event.target).text();

		this.numpad_setValue(newText);
    }

	_numpad_appendToTarget = () => {
		(this.options.appendKeypadTo ? this.options.appendKeypadTo : $(document.body))
			.append(this);
    }

	static cursorFocus = (elem) => {
		var x = window.scrollX, y = window.scrollY;
		elem.focus();
		window.scrollTo(x, y);
	}

	_numpad_constructNewNumberPadElement = (id, options) => {
		let newElement = $('<div id="' + id + '"></div>').addClass('nmpd-wrapper');

		/** @var display jQuery object representing the display of the numpad (typically an input field) */
		let display = $(options.displayTpl).addClass('nmpd-display');
		newElement.numpad_display = display;

		/** @var grid jQuery object containing the grid for the numpad: the display, the buttons, etc. */
		let table = $(options.gridTpl).addClass('nmpd-grid');
		newElement.grid = table;
		
		table.append($(options.rowTpl)
			.append($(options.displayCellTpl)
			.append(display)
			.append($('<input type="hidden" class="dirty" value="0"></input>'))));

		// Create rows and columns of the the grid with appropriate buttons
		table.append(
			$(options.rowTpl)
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(7).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(8).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(9).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textDelete).addClass('del').click(() => {
					this.numpad_setValue(this.numpad_getValue().toString().substring(0, this.numpad_getValue().toString().length - 1));
				})))
		).append(
			$(options.rowTpl)
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(4).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(5).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(6).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textClear).addClass('clear').click(() => {
					this.numpad_setValue('');
				})))
		).append(
			$(options.rowTpl)
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(1).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(2).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(3).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textCancel).addClass('cancel').click(() => {
					this.numpad_close(false);
				})))
		).append(
			$(options.rowTpl)
				.append($(options.cellTpl).append($(options.buttonFunctionTpl).html('&plusmn;').addClass('neg').click(() => {
					let currentValue = this.numpad_display.val();
					this.numpad_setValue((currentValue.startsWith('-')
						? currentValue.substring(1, currentValue.length)
						: '-' + currentValue));
				})))
				.append($(options.cellTpl).append($(options.buttonNumberTpl).html(0).addClass('numero')))
				.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.decimalSeparator).addClass('sep').click(() => {
					this.numpad_setValue(this.numpad_display.val() + options.decimalSeparator);
				})))
				.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textDone).addClass('done')))
		);

		// Create the backdrop of the numpad - an overlay for the main page
		newElement.append($(options.backgroundTpl).addClass('nmpd-overlay').click(() => { newElement.numpad_close(false); }));

		newElement.append(table);

		return newElement;
	}

	_numpad_showOrHideButtons = () => {
		if (this.options.hidePlusMinusButton) {
			this.find('.neg').hide();
		}

		if (this.options.hideDecimalButton) {
			this.find('.sep').hide();
		}
	}

	_numpad_registerEvents = () => {
		if (this.options.onKeypadCreate) {
			this.on('numpad.create', this.options.onKeypadCreate);
		}

		if (this.options.onKeypadOpen) {
			this.on('numpad.open', this.options.onKeypadOpen);
		}

		if (this.options.onKeypadClose) {
			this.on('numpad.close', this.options.onKeypadClose);
		}

		if (this.options.onChange) {
			this.on('numpad.change', this.options.onChange);
		}
	}

	_numpad_processOptionsArgAsCommand = (command, jQuerySellectorTarget) => {
		switch (command) {
			case 'open':
				this.numpad_open(this.options.target
					? this.options.target
					: jQuerySellectorTarget);
				break;
			case 'close':
				this.numpad_close(this.options.target
					? this.options.target
					: jQuerySellectorTarget);
				break;
		}
	}

	numpad_getValue = () => {
		return this._numpad_isValueNumeric(this.numpad_display.val())
			? parseFloat(this._numpad_normalizeDecimalSeparator(this.numpad_display.val()))
			: 0;
	};

	_numpad_isValueNumeric = (obj) => {
		if(typeof obj === "string"){
			obj = this._numpad_normalizeDecimalSeparator(obj);
		}
		
		return !isNaN( parseFloat( obj ) ) && isFinite( obj );
	};

	_numpad_normalizeDecimalSeparator = (obj) => {
		return obj.replace(this.options.decimalSeparator, '.');
	}

	_numpad_localizeDecimalSeparator = (obj) => {
		return obj.replace('.', this.options.decimalSeparator);
	}

	numpad_setValue = (value) => {
		value = this._numpad_cutStringLengthToMaximumAllowed(value);

		if(!this._numpad_isValueNumeric(value) && value !== ""){
			return;
		}

		this.numpad_display.val(value);
		this.find('.dirty').val('1');
		this.trigger('numpad.change', [value]);

		return this;
	};

	_numpad_cutStringLengthToMaximumAllowed = (value) => {
		let maxLengthExcludingSpecialCharacters = this.numpad_display.attr('maxLength');
		
		if(!maxLengthExcludingSpecialCharacters){
			return value;
		}

		let specialCharactersCount = 0;
		
		if(value.includes(this.options.decimalSeparator)){
			specialCharactersCount++;
		}
		
		if(value.includes('-')){
			specialCharactersCount++;
		}

		let maxLength = parseInt(maxLengthExcludingSpecialCharacters) + specialCharactersCount;

		return value.toString().substr(0, maxLength)
	}

	numpad_close = (target) => {
		// If a target element is given, set it's value to the dipslay value of the numpad. Otherwise just hide the numpad
		if (target) {
			if (target.prop("tagName") === 'INPUT') {
				target.val(this.numpad_getValue().toString().replace('.', this.options.decimalSeparator));
			}
			else {
				target.html(this.numpad_getValue().toString().replace('.', this.options.decimalSeparator));
			}
		}

		// Hide the numpad and trigger numpad.close
		this.hide();
		this.trigger('numpad.close');

		// Trigger a change event on the target element if the value has really been changed
		if (target && target.prop("tagName") === 'INPUT') {
			target.trigger('change');
		}

		return this;
	};

	numpad_open = (target, initialValue) => {
		// Set the initial value
		// Use nmpd.display.val to avoid triggering numpad.change for the initial value
		if (initialValue) {
			if(!this._numpad_isValueNumeric(initialValue)){
				console.error("The initialValue is not numeric.  Unable to set value.  It must be numeric.");
				return;
			}

			this.numpad_display.val(initialValue);
		}
		else {
			if (target.prop("tagName") === 'INPUT') {
				this.numpad_display.val(target.val());
				this.numpad_display.attr('maxLength', target.attr('maxLength'));
			} else {
				let targetText = this._numpad_isValueNumeric(target.text()) 
					? this._numpad_normalizeDecimalSeparator(target.text())
					: '' ;

				targetText = this._numpad_localizeDecimalSeparator(targetText);

				this.numpad_display.val(targetText);
			}
		}

		// Mark the numpad as not dirty initially
		$('#' + this.numpad_id + ' .dirty').val(0);

		// Show the numpad and position it on the page
		this.show()
		JQueryNumpad.cursorFocus(this.find('.cancel'));
		JQueryNumpad.positionElement(this.find('.nmpd-grid'), this.options.position, this.options.positionX, this.options.positionY);

		// Register a click handler on the done button to update the target element
		// Make sure all other click handlers get removed. Otherwise some unwanted sideeffects may occur if the numpad is
		// opened multiple times for some reason
		$('#' + this.numpad_id + ' .done').off('click');
		$('#' + this.numpad_id + ' .done').one('click', () => { this.numpad_close(target); });

		// Finally trigger numpad.open
		this.trigger('numpad.open');

		return this;
	};

	static positionElement = (element, mode, posX, posY) => {
		var x = 0;
		var y = 0;

		if (mode === 'fixed') {
			element.css('position', 'fixed');

			if (posX === 'left') {
				x = 0;
			}
			else if (posX === 'right') {
				x = $(window).width() - element.outerWidth();
			}
			else if (posX === 'center') {
				x = ($(window).width() / 2) - (element.outerWidth() / 2);
			}
			else if ($.type(posX) === 'number') {
				x = posX;
			}

			element.css('left', x);

			if (posY === 'top') {
				y = 0;
			}
			else if (posY === 'bottom') {
				y = $(window).height() - element.outerHeight();
			}
			else if (posY === 'middle') {
				y = ($(window).height() / 2) - (element.outerHeight() / 2);
			}
			else if ($.type(posY) === 'number') {
				y = posY;
			}

			element.css('top', y);
		}

		return element;
	}

	static defaults = {
		target: false,
		openOnEvent: 'click',
		backgroundTpl: '<div></div>',
		gridTpl: '<table></table>',
		displayTpl: '<input type="text" />',
		displayCellTpl: '<td colspan="4"></td>',
		rowTpl: '<tr></tr>',
		cellTpl: '<td></td>',
		buttonNumberTpl: '<button></button>',
		buttonFunctionTpl: '<button></button>',
		gridTableClass: '',
		hidePlusMinusButton: false,
		hideDecimalButton: false,
		textDone: 'Done',
		textDelete: 'Del',
		textClear: 'Clear',
		textCancel: 'Cancel',
		decimalSeparator: ',',
		precision: null,
		appendKeypadTo: false,
		position: 'fixed',
		positionX: 'center',
		positionY: 'middle',
		onKeypadCreate: false,
		onKeypadOpen: false,
		onKeypadClose: false,
		onChange: false
	};
}
