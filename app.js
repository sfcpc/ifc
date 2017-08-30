define([
	'knockout',
	'underscore',
	'jquery'
], function(ko, _, $) {
	var App = function(params) {
		var self = this;
		this.name = params.name || "";
		this.state = ko.observable(params.state || 'trigger');
		this.loading = ko.observable(false);
		this.feeViewModels = ko.observableArray();
		this.selectedFee = ko.observable();
		var now = new Date();
		this.reportDate = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();

		this.total = ko.computed(function() {
			var total = 0;
			this.feeViewModels().forEach(function(feeViewModel) {
				if (feeViewModel.triggered()) {
					total += feeViewModel.calculatedFee();
				}
			});
			return total;
		}, this);

		this.triggeredFeeViewModels = ko.computed(function() {
			var feeViewModels = this.feeViewModels();
			return _.filter(feeViewModels, function(feeViewModel) {
				return feeViewModel.triggered();
			});
		}, this);

		this.triggeredFeeViewModels.subscribe(function() {
			var feeViewModels = self.triggeredFeeViewModels();
			self.selectedFee(feeViewModels.length > 0 ? feeViewModels[0] : null)
		});

        // trigger parameters
		this.geometry = ko.observable(params.geometry || null);
		this.newUnits = ko.observable(params.newUnits || null);
		this.removedUnits = ko.observable(params.removedUnits || null);
        this.newNonRes = ko.observable(params.newNonRes || null);
        this.nonResGSF = ko.observable(params.nonResGSF || null);
        this.pdrGSF = ko.observable(params.pdrGSF || null);
        this.resGSF = ko.observable(params.resGSF || null);
        this.changeOfUse = ko.observable(params.changeOfUse || null);
		this.netNewUnits = ko.computed(function() {
			var newUnits = this.newUnits() || 0;
			var removedUnits = this.removedUnits() || 0;
			return newUnits - removedUnits;
		}, this);

		this.triggersReady = ko.computed(function() {
			var newUnits = this.newUnits();
			var removedUnits = this.removedUnits();
            var newNonRes = this.newNonRes();
            var nonResGSF = this.nonResGSF();
            var pdrGSF = this.pdrGSF();
            var resGSF = this.resGSF();
            var changeOfUse = this.changeOfUse();
			return removedUnits !== null && removedUnits !== '' &&
				newUnits !== null && newUnits !== '' &&
                newNonRes !== null && newNonRes !== '' &&
                nonResGSF !== null && nonResGSF !== '' &&
                pdrGSF !== null && pdrGSF !== '' &&
                resGSF !== null && resGSF !== '' &&
                changeOfUse !== null && changeOfUse !== '' &&
				this.geometry();
		}, this);

		this.feesReady = ko.computed(function() {
			if (!this.triggersReady()) {
				return false;
			}
			var feeViewModels = this.feeViewModels();
			var ready = true;
			feeViewModels.forEach(function(feeViewModel) {
				if (!feeViewModel.ready()) {
					ready = false;
				}
			});
			return ready;
		}, this);

		this.viewTrigger = function() {
			self.state('trigger');
		};

		this.viewCalculate = function() {
			if (self.triggersReady()) {
				self.state('calculate');
			}
		};

		this.viewReport = function() {
			if (self.feesReady()) {
				self.state('report');
			}
		};

		this.queryString = ko.computed(function() {
			var feeViewModelJSON = {};
			_.each(this.feeViewModels(), function(feeViewModel) {
				feeViewModelJSON[feeViewModel.feeTypeName] = feeViewModel.json();
			});
			var appJSON = {
				state: this.state(),
				newUnits: this.newUnits(),
				removedUnits: this.removedUnits(),
                newNonRes: this.newNonRes(),
                nonResGSF: this.nonResGSF(),
                pdrGSF: this.pdrGSF(),
                resGSF: this.resGSF(),
                changeOfUse: this.changeOfUse(),
				geometry: this.geometry(),
				fees: JSON.stringify(feeViewModelJSON)
			}
			return '?' + $.param(appJSON).split('+').join('%20');
		}, this);

		this.linkURL = ko.computed(function() {
			var queryString = this.queryString();
			return window.location.origin + window.location.pathname + queryString;
		}, this);

		this.copyModBtn = window.navigator.platform === 'MacIntel' ? 'Cmd' : 'Ctrl';
	};

	return App;
});
