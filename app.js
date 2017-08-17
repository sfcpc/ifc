define([
	'knockout',
	'underscore'
], function (ko, _) {
	var App = function(params) {
		var self = this;
		this.name = params.name || "";
		this.state = ko.observable(params.state || 'trigger');
		this.loading = ko.observable(false);
		this.feeViewModels = ko.observableArray();
		this.selectedFee = ko.observable();
		
		this.triggeredFeeViewModels = ko.computed(function() {
			var feeViewModels = this.feeViewModels();
			return _.filter(feeViewModels, function (feeViewModel) {
				return feeViewModel.triggered();
			});
		}, this);
		
		this.netNewDwellings = ko.observable(params.netNewDwellings || null);
		
		this.triggersReady = ko.computed(function () {
			var netNewDwellings = this.netNewDwellings();
			return netNewDwellings !== null && netNewDwellings !== '';
		}, this);
		
		this.feesReady = ko.computed(function () {
			var feeViewModels = this.feeViewModels();
			var ready = true;
			feeViewModels.forEach(function (feeViewModel) {
				if (!feeViewModel.ready()) {
					ready = false;
				}
			});
			return ready;
		}, this);
		
		this.viewTrigger = function () {
			self.state('trigger');
		};
		
		this.viewCalculate = function () {
			if (self.triggersReady()) {
				self.state('calculate');
			}
		};
		
		this.viewReport = function () {
			if (self.feesReady()) {
				self.state('report');
			}
		};
		
		this.json = ko.computed(function () {
			var feeViewModelJSON = {};
			_.each(this.feeViewModels(), function(feeViewModel) {
				feeViewModelJSON[feeViewModel.feeTypeName] = feeViewModel.json();
			});
			return {
				state: this.state(),
				netNewDwellings: this.netNewDwellings(),
				fees: JSON.stringify(feeViewModelJSON)
			}
		}, this);
	};
	return App;
});