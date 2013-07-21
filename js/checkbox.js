/**
 * A plain checkbox implementation.
 *
 * @type {{makeField: Function, value: Function, displayValue: Function}}
 */
$.fn.jinplace.editors['extra:checkbox'] = {

	makeField: function(element, data) {
		this.blurAction = 'submit';

		var choices;

		if (data.charAt(0) == '[')
			choices = $.parseJSON(data);

		if (!choices || choices.length < 2)
			choices = ["No", "Yes"];

		this.choices = choices;

		var f = $('<input type=checkbox>');
		f.on('click', function(ev) {ev.stopPropagation();});

		// Set the checkbox to the checked state if the text matches the 'true' value.
		var text = $.trim(element.text());
		f.attr('checked', text == choices[1]);

		return f;
	},

	value: function() {
		return this.inputField.prop('checked')? 1: 0;
	},

	displayValue: function(data) {
		return this.choices[data ? 1 : 0];
	}
};
