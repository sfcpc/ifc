define([
    "knockout"
], function(ko) {
    return ko.bindingHandlers.numericText = {
        update: function(element, valueAccessor, allBindingsAccessor) {
            var value = parseFloat(ko.utils.unwrapObservable(valueAccessor())) || 0;
            var formattedValue = (Math.round(value * 1000) / 1000)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            ko.bindingHandlers.text.update(element, function() {
                return formattedValue;
            });
        }
    };
});
