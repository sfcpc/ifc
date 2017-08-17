define([
    'knockout',
    'fees/abstract-component'
], function (ko, AbstractComponent) {
    ko.components.register('mock-fee', {
        viewModel: AbstractComponent,
        template: { require: 'text!fees/mock-fee/template.html' }
    });
    return name;
});