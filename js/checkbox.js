/**
 * A plain checkbox implementation.
 *
 * @type {editorBase}
 */
$.fn.jinplace.editors['extra:checkbox'] = {
	blurAction: 'ignore',

	makeField: function(element, data) {
		var choices;

		if (data.charAt(0) == '[')
			choices = $.parseJSON(data);

		if (!choices || choices.length < 2)
			choices = ["No", "Yes"];

		this.choices = choices;

		var field = $('<input type=checkbox>');

		var ios = navigator.userAgent.match(/(ipad|ipod|iphone)/i);
		var stopSubmit = false;

		// Set up events. Complicated by chrome/safari not dealing with focus on
		// checkbox elements as other browsers do.
		field   .on('click', function(ev) {ev.stopPropagation(); })
				.on('change', function(ev) {field.focus(); })
		;

		if (ios) {
			field.on('touchstart', function(ev) {
				stopSubmit = true;
				setTimeout(function () {
					stopSubmit = false;
				}, 300);

			});

			$(document)
					.off('touchstart.jip')
					.on('touchstart.jip', function(ev) {
						if (!stopSubmit)
							element.find('form').trigger('submit');
					});
		}


		this.blurEvent(field, field, 'submit');

		// Set the checkbox to the checked state if the text matches the 'true' value.
		var text = $.trim(element.text());
		field.attr('checked', text == choices[1]);

		return field;
	},

	value: function() {
		return this.inputField.prop('checked')? 1: 0;
	},

	displayValue: function(data) {
		return this.choices[data != '0' ? 1 : 0];
	},

	finish: function() {
		$(document).off('touchstart.jip');
	}
};
