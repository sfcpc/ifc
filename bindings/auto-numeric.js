define([
    "knockout",
    "jquery",
    "autoNumeric"
], function(ko, $, autoNumeric) {
    ko.bindingHandlers.autoNumeric =  {
        init: function (el, valueAccessor, bindingsAccessor, viewModel) {
            var $el = $(el),
                bindings = bindingsAccessor(),
                settings = bindings.settings,
                value = valueAccessor();

            $el.autoNumeric(settings);
            $el.autoNumeric('set', );
            $el.change(function() {
                value(parseFloat($el.autoNumeric('get'), 10));
            });
        },
        update: function (el, valueAccessor, bindingsAccessor, viewModel) {
            var $el = $(el),
                newValue = parseFloat(ko.utils.unwrapObservable(valueAccessor()), 10),
                elementValue = parseFloat($el.autoNumeric('get'), 10),
                valueHasChanged = (newValue != elementValue);

            if (isNaN(newValue)) {
                newValue = null;
            }

            if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0")) {
                valueHasChanged = true;
            }

            if (valueHasChanged) {
                $el.autoNumeric('set', newValue);
                setTimeout(function () { $el.change() }, 0);
            }
        }
    };
});
