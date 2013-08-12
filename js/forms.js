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
