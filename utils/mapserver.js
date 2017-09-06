define([
	'jquery',
	'openlayers',
	'json!settings.json',
], function($, ol, settings) {
	var esrijsonFormat = new ol.format.EsriJSON();
	var geojsonFormat = new ol.format.GeoJSON();

	var mapserverUtils = {
        getAreaGeoJSON: function(feeName, callback) {
            $.getJSON(settings.mapserver + '/' + settings.areaLayer + '/query', {
                where: "FEE='" + feeName + "'",
                geometryType: 'esriGeometryEnvelope',
                spatialRel: 'esriSpatialRelIntersects',
                returnGeometry: true,
                returnIdsOnly: false,
                returnCountOnly: false,
                returnZ: false,
                returnM: false,
                returnDistinctValues: false,
                returnTrueCurves: false,
                outSR: 102100,
                f: 'json'
            }, function(data) {
                if (data['error']) {
                    console.error('Get fee area failed: ' + data['error'].message);
                    return;
                }
                var geom = esrijsonFormat.readGeometry(data.features[0].geometry);
                geom = geojsonFormat.writeGeometry(geom);
                callback(JSON.parse(geom));
            });
        }
    }

	return mapserverUtils;
});
