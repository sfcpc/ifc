define([
	"knockout"
], function(ko) {
	return ko.bindingHandlers.numericText = {
		update: function(element, valueAccessor, allBindingsAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor()),
				formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;

			ko.bindingHandlers.text.update(element, function() {
				return formattedValue;
			});
		}
	};
});
