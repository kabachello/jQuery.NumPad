(function($){
    $.fn.numpad=function(options){

		var defaults = {
            target: false,
			openOnEvent: 'click',
			backgroundTpl: '<div></div>',
			displayTpl: '<input type="number" />',
			displayCellTpl: '<td colspan="4"></td>',
			rowTpl: '<tr></tr>',
			cellTpl: '<td></td>',
			buttonNumberTpl: '<button></button>',
			buttonFunctionTpl: '<button></button>',
			gridTableClass: '',
			textDone: 'Done',
			textDelete: 'Del',
			textClear: 'Clear',
			textCancel: 'Cancel',
			appendNumPadTo: $(document.body)
        };
		
		options = $.extend({}, defaults, options);
		
		return this.each(function(){
			$(this).attr("readonly", true);
			$(this).unbind(options.openOnEvent);
			$(this).bind(options.openOnEvent,function(){
				nmpd.open();
			});

			if ($('#nmpd').length == 0) {
				var nmpd = $('<div id="nmpd"></div>').css('display', 'none');
				var table = $('<table class="nmpd-grid '+options.gridTableClass+'" id="n_keypad">');
				var display = $(options.displayTpl).addClass('nmpd-display').attr('id', 'nmpd-display');
				nmpd.display = display;
				table.append($(options.rowTpl).append($(options.displayCellTpl).append(display)));			
				table.append(
					$(options.rowTpl)
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(7).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(8).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(9).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textDelete).addClass('del').click(function(){
							display.val(display.val().substring(0,display.val().length - 1));
						})))
					).append(
					$(options.rowTpl)
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(4).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(5).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(6).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textClear).addClass('clear').click(function(){
							display.val('');
						})))
					).append(
					$(options.rowTpl)
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(1).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(2).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(3).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textCancel).addClass('cancel').click(function(){
							nmpd.close(true);
						})))
					).append(
					$(options.rowTpl)
						.append($(options.cellTpl).append($(options.buttonFunctionTpl).html('-').addClass('neg').click(function(){
							if (!isNaN(display.val()) && display.val().length > 0) {
								if (parseInt(display.val()) > 0) {
									display.val(parseInt(display.val()) - 1);
								}
							}
						})))
						.append($(options.cellTpl).append($(options.buttonNumberTpl).html(0).addClass('numero')))
						.append($(options.cellTpl).append($(options.buttonFunctionTpl).html('+').addClass('pos').click(function(){
							if (!isNaN(display.val())) {
								if (display.val().length == 0) {
									display.val(1);
								} else {
									display.val(parseInt(display.val()) + 1);
								}
							}
						})))
						.append($(options.cellTpl).append($(options.buttonFunctionTpl).html(options.textDone).addClass('done')))
					);
				nmpd.append($(options.backgroundTpl).addClass('nmpd-overlay').attr('id', 'nmpd-overlay'));
				nmpd.append(table);
				options.appendNumPadTo.append(nmpd).enhanceWithin();    
			
				$('.numero').bind('click', function(){
					display.val(display.val() + $(this).text());
				});
			} else {
				nmpd = $('#nmpd');
				nmpd.display = $('#nmpd input.nmpd-display');
			}
			
			nmpd.target = options.target ? options.target : $(this);
			$('#nmpd .done').click(function(){ nmpd.close(false); });

			nmpd.close = function(discardInput){
				if (discardInput !== true){
					if (nmpd.target.prop("tagName") == 'INPUT'){
						nmpd.target.val(nmpd.display.val());
					} else {
						nmpd.target.html(nmpd.display.val());
					}
				} 
				nmpd.hide('fast');
				return nmpd;
			}
			
			nmpd.open = function(initialValue){
				if (initialValue){
					nmpd.display.val(initialValue);
				} else {
					if (nmpd.target.prop("tagName") == 'INPUT'){
						nmpd.display.val(nmpd.target.val());
					} else {
						nmpd.display.val(parseFloat(nmpd.target.html()));
					}
				}
				nmpd.show('fast');
				return nmpd;
			}		  
		});
    }
})(jQuery);