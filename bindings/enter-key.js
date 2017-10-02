define([
    "knockout",
    "jquery"
], function(ko, $) {
    return ko.bindingHandlers.enterKey = {
        init: function(element, valueAccessor, allBindings, viewModel) {
            var callback = valueAccessor();
            $(element).keypress(function(event) {
                var keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    callback.call(viewModel);
                    event.stopPropagation();
                    return false;
                }
                return true;
            });
        }
    };
});
