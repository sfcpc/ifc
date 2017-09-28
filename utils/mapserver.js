define([
    'jquery',
    'openlayers',
    'turf',
    'json!settings.json',
], function($, ol, turf, settings) {
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
        },
        isProjectInArea: function(projectGeom, areaGeom) {
            if (!projectGeom() || !areaGeom()) {
                return false;
            }
            var projectGeomPoints = turf.explode(JSON.parse(projectGeom()));
            var areaGeom = turf.featureCollection([
                areaGeom()
            ]);
            var within = turf.within(
                projectGeomPoints,
                areaGeom
            );
            return within.features.length > 0;
        }
    }

    return mapserverUtils;
});
