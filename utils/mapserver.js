define([
    'jquery',
    'openlayers',
    'turf',
    'json!settings.json',
], function($, ol, turf, settings) {
    var esrijsonFormat = new ol.format.EsriJSON();
    var geojsonFormat = new ol.format.GeoJSON();

    var mapserverUtils = {
        getAreaGeoJSON: function(areaName, callback, fieldName, namedAreaLayer) {
            fieldName = fieldName || 'FEE';
            areaLayer = namedAreaLayer || settings.areaLayer;
            $.getJSON(settings.mapserver + '/' + areaLayer + '/query', {
                where: fieldName + "='" + areaName + "'",
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
                var geoms = [];
                if (data['error']) {
                    console.error('Get fee area failed: ' + data['error'].message);
                    return;
                }
                if (data.features.length > 0){
                    data.features.forEach(function(feature) {
                        var geom = esrijsonFormat.readGeometry(feature.geometry);
                        geom = geojsonFormat.writeGeometry(geom);
                        geom = JSON.parse(geom);
                        geom.areaName = areaName;
                        geoms.push(geom);
                    });
                    callback(geoms);
                }
            });
        },
        isProjectInArea: function(projectGeom, areaGeoms) {
            var projectGeom = projectGeom();
            var areaGeoms = areaGeoms();
            if (!projectGeom || !areaGeoms || areaGeoms.length === 0) {
                return false;
            }
            var intersects = false;
            projectGeom = JSON.parse(projectGeom);
            areaGeoms.forEach(function(areaGeom) {
                var intersection = turf.intersect(projectGeom, areaGeom);
                if (intersection !== undefined) {
                    if (!intersects) {
                        intersects = [];
                    }
                    intersects.push(areaGeom);
                }
            });
            return intersects;
        },
        queryLayer: function(geometry, layer, callback) {
            var geoJSONGeom = geometry();
            if (geoJSONGeom) {
                geom = geojsonFormat.readGeometry(geoJSONGeom);
                $.getJSON(settings.mapserver + '/' + layer + '/query', {
                    geometry: geom.getExtent().join(','),
                    inSR: 102100,
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
                        console.error('Query mapserver layer (' + layer + ') failed: ' + data['error'].message);
                        return;
                    }
                    var intersectedFeatures = [];
                    data.features.forEach(function(feature) {
                        var geometry = esrijsonFormat.readGeometry(feature.geometry);
                        geometry = geojsonFormat.writeGeometry(geometry);
                        var intersection = turf.intersect(
                            JSON.parse(geoJSONGeom),
                            JSON.parse(geometry)
                        );
                        if (intersection !== undefined) {
                            feature.attributes.layer = layer;
                            intersectedFeatures.push(feature);
                        }
                    });
                    callback(intersectedFeatures);
                });
            }
        }
    };

    return mapserverUtils;
});
