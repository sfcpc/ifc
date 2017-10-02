define([
    "knockout",
    'openlayers',
    'jquery',
    'turf',
    "json!settings.json"
], function(ko, ol, $, turf, settings) {
    return ko.bindingHandlers.olMap = {
        init: function(el, valueAccessor, allBindingsAccessor, viewmodel, bindingContext) {
            var readOnly = allBindingsAccessor().readOnly;
            var selectedPoint = allBindingsAccessor().selectedPoint || ko.observable();
            var onMapReady = allBindingsAccessor().onMapReady || function() {
                return
            };
            var esrijsonFormat = new ol.format.EsriJSON();
            var geojsonFormat = new ol.format.GeoJSON();
            var vectorSource = new ol.source.Vector();
            var geometry = valueAccessor();
            var updateFeature = function(geojsonGeom) {
                vectorSource.clear();
                if (geojsonGeom) {
                    var geom = geojsonFormat.readGeometry(geojsonGeom);
                    vectorSource.addFeature(new ol.Feature(geom));
                }
            };
            geometry.subscribe(updateFeature);
            updateFeature(geometry());

            var layers = [
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        attributions: 'Tiles © <a href="' + settings.basemap + '">ArcGIS</a>',
                        url: settings.basemap + '/tile/{z}/{y}/{x}'
                    })
                }),
                new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                        url: settings.mapserver,
                        params: {
                            layers: 'show:' + settings.somaDistrictsLayer
                        }
                    }),
                    opacity: 0.4
                }),
                new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                        url: settings.mapserver,
                        params: {
                            layers: 'show:' + settings.areaLayer
                        }
                    }),
                    opacity: 0.4
                }),
                new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                        url: settings.mapserver,
                        params: {
                            layers: 'show:' + settings.parcelLayer
                        }
                    }),
                    maxResolution: 2.323339178970923
                }),
                new ol.layer.Vector({
                    source: vectorSource,
                    style: [
                        new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'rgba(249, 149, 32, 1)',
                                width: 3
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(249, 149, 32, 0.3)'
                            })
                        })
                    ]
                })
            ];
            var view = new ol.View({
                center: settings.center,
                zoom: settings.zoom,
                maxZoom: 18
            });

            var map = new ol.Map({
                layers: layers,
                target: el,
                view: view
            });

            onMapReady(map);

            if (geometry()) {
                var geom = geojsonFormat.readGeometry(geometry());
                view.fit(geom, map.getSize())
            }

            selectedPoint.subscribe(function(point) {
                if (point) {
                    $.getJSON(settings.mapserver + '/identify', {
                        f: 'json',
                        geometry: JSON.stringify({
                            "x": point[0],
                            "y": point[1],
                            "spatialReference": {
                                "wkid": 102100,
                                "latestWkid": 3857
                            }
                        }),
                        tolerance: 0,
                        returnGeometry: true,
                        mapExtent: JSON.stringify({
                            "xmin": point[0],
                            "ymin": point[1],
                            "xmax": point[0],
                            "ymax": point[1],
                            "spatialReference": {
                                "wkid": 102100,
                                "latestWkid": 3857
                            }
                        }),
                        geometryType: 'esriGeometryPoint',
                        sr: 102100,
                        layers: 'all:' + settings.parcelLayer,
                        imageDisplay: '496,1374,96'
                    }, function(data) {
                        if (data['error']) {
                            console.error('Get parcel failed: ' + data['error'].message);
                            return;
                        }
                        if (data.results && data.results.length > 0) {
                            var geom = esrijsonFormat.readGeometry(data.results[0].geometry);
                            geom = geojsonFormat.writeGeometry(geom);
                            if (geometry()) {
                                var union = turf.union({
                                    type: "Feature",
                                    geometry: JSON.parse(geom)
                                }, {
                                    type: "Feature",
                                    geometry: JSON.parse(geometry())
                                });
                                if (union.geometry.type === 'Polygon') {
                                    geometry(JSON.stringify(union.geometry));
                                    return;
                                }
                            }
                            geometry(geom);
                        } else {
                            geometry(null);
                        }
                    });
                }
            })

            if (!readOnly) {
                map.on('click', function(e) {
                    selectedPoint(e.coordinate);
                });
            }
        }
    };
});
