define([
    "knockout"
], function(ko) {
    return ko.bindingHandlers.ratioText = {
        update: function(element, valueAccessor, allBindingsAccessor) {
            var value = parseFloat(ko.utils.unwrapObservable(valueAccessor())) || 0;
            var tolerance = 1.0E-6;
            var h1 = 1;
            var h2 = 0;
            var k1 = 0;
            var k2 = 1;
            var b = value;
            do {
                var a = Math.floor(b);
                var aux = h1;
                h1 = a * h1 + h2;
                h2 = aux;
                aux = k1;
                k1 = a * k1 + k2;
                k2 = aux;
                b = 1 / (b - a);
            } while (Math.abs(value - h1 / k1) > value * tolerance);
            ko.bindingHandlers.text.update(element, function() {
                return h1 + ":" + k1;
            });
        }
    };
});
