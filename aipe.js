/**
 * AjaxInPlaceEditor.js
 * author : Tisserand David
 * version : 1
 * NEED JQUERY
 */

function AIPE(node, options) {

	var options = options || [];
	/* Default Config */
	var defaults = {
		url: false,
		method: 'POST',
		resultClass: '',
		inputClass: '',
		controlValue: false,
		defaultDisplay: 'auto',
		success: false,
		complete: false,
		fail: false,
	};
	/* Construct */
	this.options = $.extend({}, defaults, options);

	/* Initialization */
	this.init = function() {
		var that = this;
		$(node).each(function(){
			var element = $(this);
			/* Only for text field */
			if (element.prop('tagName') == 'SPAN' || element.prop('tagName') == 'DIV') {
				var initialValue = element.html();
				var defaultDisplay = that.options.defaultDisplay=='auto' ? element.css('display') : that.options.defaultDisplay;
				element.html('');
				element.append('<div class="result" style="display: inline-block;"><div>');
				element.children('.result').html(initialValue);
				element.append('<div class="edition"><input type="text" class="edition-input" value="'+initialValue+'" /></div>');
				var result = element.children('.result');
				var edition = element.children('.edition');
				var input = edition.children('.edition-input');
				result.addClass(that.options.resultClass);
				input.addClass(that.options.inputClass);
				edition.hide();
				result.click(function(){
					value = input.val();
					edition.css('display', defaultDisplay);
					result.hide();
					input.focus();

				});
				input.blur(function(){
					edition.hide();
					result.css('display', defaultDisplay);
					var url = element.data('url')!='' ? element.data('url') : that.options.url;
					var id = element.data('id');
					var field = element.data('field');
					var token = element.data('token');
					var newValue = input.val();
					// Controle de la modification de la valeur du champ
					if (newValue != value && newValue != '' && newValue != undefined) {
						// Controle de la conformité de la valeur
						if (that.options.controlValue == false || (typeof that.options.controlValue == "function" && that.options.controlValue(newValue))) {
							result.addClass('loading');
							$.ajax({
								url: url,
								method: that.options.method,
								data: {field: field, value: newValue, id: id, token: token}
							}).done(function(r){
								if (r.success) { result.text(newValue); }
								if (typeof that.options.success == "function") {
									that.options.success(r);
								} else {
									console.log('AIPE REQUEST SUCCESS');
								}
								result.removeClass('loading');
							}).fail(function(jqXHR, textStatus){
								if (typeof that.options.fail == "function") {
									that.options.onFailure(jqXHR, textStatus);
								} else {
									console.log('AIPE REQUEST ERROR : '+textStatus);
								}
								result.removeClass('loading');
							}).always(function(r) {
								if (typeof that.options.complete == "function") {
									that.options.complete(r);
								} else {
									console.log('AIPE REQUEST COMPLETE');
								}
							});
						}
					}
				});
				input.keydown(function(event){
				    var keycode = (event.keyCode ? event.keyCode : event.which);
				    if(keycode == '13'){
				        input.blur();
				    } else if(keycode == '27') {
				    	input.val(result.text());
				    	input.blur();
				    }
				});
			} else if (element.prop('tagName') == 'INPUT' || element.prop('tagName') == 'SELECT') {
				element.on('change', function() {
					console.log('Changing ...');
					var url = element.data('url')!='' ? element.data('url') : that.options.url;
					var id = element.data('id');
					var field = element.data('field');
					var token = element.data('token');
					var newValue = element.val();
					$.ajax({
						url: url,
						method: that.options.method,
						data: {field: field, value: newValue, id: id, token: token}
					}).done(function(r){
						if (typeof that.options.success == "function") {
							that.options.success(r);
						} else {
							console.log('AIPE REQUEST SUCCESS');
						}
						result.removeClass('loading');
					}).fail(function(jqXHR, textStatus){
						if (typeof that.options.fail == "function") {
							that.options.fail(jqXHR, textStatus);
						} else {
							console.log('AIPE REQUEST ERROR : '+textStatus);
						}
					}).always(function(r) {
						if (typeof that.options.complete == "function") {
								that.options.complete(r);
							} else {
								console.log('AIPE REQUEST COMPLETE');
							}
					});
				});
			}
		});
	}

	this.init();

}
