/** @preserve ALL PLUGINS INCLUDING EXPERIMENTAL ONES
 * MIT Licence
*/
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

/**
 * A labeled checkbox editor. This was designed to demo as many API
 * functions as possible and so may or may not be ideal for actual use.
 * It can be used as a base for other variations on the idea.
 *
 * @type {editorBase}
 */
$.fn.jinplace.editors['extra:checkbox_demo'] = {
	blurAction: 'ignore', // don't add default action

	// This should make the editing form that will be added.
	// We are using a label containing a checkbox and some text.
	// It returns the label and remembers a number of other values that
	// will be needed in parts of the plugin.
	makeField: function(element, data) {
		var label = $('<label/>');
		var checkbox = $('<input type="checkbox">');
		label.append(checkbox);

		var text = $.trim(element.text());

		// Get the text for the off/on values of the checkbox
		var values;
		if (data.charAt(0) == '[')
			values = $.parseJSON(data);
		else
			values = ["No", "Yes"];

		// If the original text matches our 'on' value, set the initial state
		// of the checkbox
		checkbox.attr('checked', values[1] == text);

		var textNode = $('<span>' + text + '</span>');
		label.append(textNode);

		this.choices = values;
		this.inputField = checkbox;
		this.label = label;
		this.textNode = textNode;

		return label;
	},

	// The form has been added to the document and so we can set up events
	activate: function(form, field) {
		var self = this;

		field.focus();

		this.label
				.on('click', function (ev) {
					// Prevent the click from going any further
					ev.stopPropagation();
				})
				.on('change', function(ev) {
					// Get the checked state and set the text to match it
					var checked = self.inputField.prop('checked');
					self.textNode.text(self.choices[checked ? 1 : 0]);
					field.focus(); // re-focus for chrome
				});

		this.blurEvent(this.inputField, this.label, 'submit');
	},

	// Returns the value that should be sent to the server.
	// Our spec says 0 and 1, so we look at the 'checked' property
	// and return the appropriate value
	value: function() {
		return this.inputField.prop('checked')? 1: 0;
	},

	// Converts the value received as a reply from the server into the text
	// to display when the editing control is removed.
	// In our case the data should be 0 or 1, but we make sure that any true value
	// received will be mapped to 1.
	displayValue: function(data) {
		return this.choices[data? 1: 0];
	}
};

/**
 *
 */
$.fn.jinplace.editors['extra:form'] = {

	makeField: function(element, data) {
		console.log("form make field");
		var self = this;
		var cl = element.clone();
		var e = cl.find(".editable-field");

		var editors = $.fn.jinplace.editors;
		var base = $.fn.jinplace.editorBase;

		e.each(function(i, val) {
			val = $(val);
			var type = val.attr('data-type') || 'input';
			var editor = $.extend({}, base, editors[type]);
			if (editor) {
				var fdata = val.attr('data-data') || val.html();
				val.data('save-value', fdata);
				var field = editor.makeField(element, fdata);
				field.attr('name', val.attr('data-attribute'));
				val.html(field);
			}
		});

		return cl;
	},

	value: function() {
		console.log('form get value');

		var params = {};
		$.each(this.inputField.serializeArray(), function(i, val) {
			params[val.name] = val.value;
		});

		return params;
	}

};

$.fn.jinplace.editors['extra:submit'] = {
	makeField: function(element, data) {
		var f = $('<input type=submit>');
		f.val('Go');
		f.attr('name', element.attr('data-attribute'));
		f.on('click', function(ev) {
			f.trigger('submit');
			return false;
		});
		return f;
	}
};
