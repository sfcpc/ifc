define([
	'knockout',
	'fees/abstract-component',
	'json!./settings.json'
], function(ko, AbstractComponent, settings) {
	ko.components.register(settings.name, {
		viewModel: AbstractComponent,
		template: {
			require: 'text!fees/' + settings.name + '/template.html'
		}
	});
	return name;
});
