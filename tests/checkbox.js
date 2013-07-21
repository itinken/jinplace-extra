
( function() {
	var span;
	module("extra:checkbox", {
				setup: function() {
					span = $('<span data-type="extra:checkbox">Yes</span>');
				}
			}
	);

	var qfix = $("#qunit-fixture");
	test("Default checked for yes", 2, function() {
		span.appendTo(qfix).jinplace();

		equal(span.text(), "Yes");

		span.click();
		var inp = span.find('input');
		equal(inp.prop('checked'), true);
	});

	test("Default unchecked for No", 1, function() {
		span.text('No').appendTo(qfix).jinplace();

		span.click();

		var inp = span.find('input');
		equal(inp.prop('checked'), false);
	});

	test("After blur, no checkbox, correct text", 3, function() {
		span.appendTo(qfix).jinplace();

		span.click();
		var inp = span.find('input');
		equal(inp.prop('checked'), true);

		$('#other').focus();

		// The blur event is processed after a timeout, so we have to wait a bit longer
		// and then test the assertions.
		stop();
		setTimeout(function () {
			equal(span.find('input').length, 0, 'no input after timeout');
			equal(span.text(), 'Yes', 'text set');

			start();
		}, BLUR_TIMEOUT);

	});

	test("After change state and blur, text is No", 4, function() {
		span.appendTo(qfix).jinplace();
		equal(span.text(), "Yes");

		span.click();
		var inp = span.find('input');
		inp.click();
		equal(inp.prop('checked'), false, 'checkbox deselected');

		$('#other').focus();

		// The blur event is processed after a timeout, so we have to wait a bit longer
		// and then test the assertions.
		stop();
		setTimeout(function () {
			equal(span.find('input').length, 0, 'no input after timeout');
			equal(span.text(), 'No', 'text set');

			start();
		}, BLUR_TIMEOUT);

	});

} )();
