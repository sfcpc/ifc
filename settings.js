define([
	"underscore",
	'json!settings.json',
	'json!settings-local.json'
], function (_, settings, settingsLocal) {
	return _.extend(settings, settingsLocal);
});