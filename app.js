define([
	'knockout',
	'underscore',
	'jquery'
], function (ko, _, $) {
	var App = function(params) {
		var self = this;
		this.name = params.name || "";
		this.state = ko.observable(params.state || 'trigger');
		this.loading = ko.observable(false);
		this.feeViewModels = ko.observableArray();
		this.selectedFee = ko.observable();
		this.reportDate = (function() {
			var now = new Date();
			return  (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
		})();
		
		this.total = ko.computed(function () {
			var total = 0;
			this.feeViewModels().forEach(function (feeViewModel) {
				if (feeViewModel.triggered()) {
					total += feeViewModel.calculatedFee();
				}
			});
			return total;
		}, this);
		
		this.triggeredFeeViewModels = ko.computed(function() {
			var feeViewModels = this.feeViewModels();
			return _.filter(feeViewModels, function (feeViewModel) {
				return feeViewModel.triggered();
			});
		}, this);
		
		this.triggeredFeeViewModels.subscribe(function () {
			var feeViewModels = self.triggeredFeeViewModels();
			self.selectedFee(feeViewModels.length > 0 ? feeViewModels[0] : null)
		});
		
		this.newDwellings = ko.observable(params.newDwellings || null);
		this.removedDwellings = ko.observable(params.removedDwellings || null);
		this.netNewDwellings = ko.computed(function () {
			var newDwellings = this.newDwellings() || 0;
			var removedDwellings = this.removedDwellings() || 0;
			return newDwellings - removedDwellings;
		}, this);
		
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
				newDwellings: this.newDwellings(),
				removedDwellings: this.removedDwellings(),
				fees: JSON.stringify(feeViewModelJSON)
			}
		}, this);
		
		this.linkURL = ko.computed(function () {
			this.json();
			return window.location.href;
		}, this);
		
		this.copyModBtn = window.navigator.platform === 'MacIntel' ? 'Cmd' : 'Ctrl';
		
		$('#linkModal').on('shown.bs.modal', function () {
			$('#linkInput').focus().select()
		});
		$('#linkInput').keypress(function(e) {
		    e.preventDefault();
		});
	};
	return App;
});