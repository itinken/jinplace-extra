/**
 * A labeled checkbox editor. This was designed to demo as many API
 * functions as possible and so may or may not be ideal for actual use.
 * It can be used as a base for other variations on the idea.
 *
 * @type {{makeField: Function, activate: Function, value: Function, displayValue: Function, blurEvent: Function}}
 */
$.fn.jinplace.editors.checkbox_demo = {
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
