define([
    "knockout"
], function(ko) {
    return ko.bindingHandlers.dollarsText = {
        update: function(element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var formattedValue = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            ko.bindingHandlers.text.update(element, function() {
                return '$' + formattedValue;
            });
        }
    };
});
