define([
	"knockout",
	'openlayers',
	'jquery',
	'turf'
], function(ko, ol, $, turf) {
	return ko.bindingHandlers.olMap = {
		init: function(el, valueAccessor, allBindingsAccessor, viewmodel, bindingContext) {
			var mapserverURL = 'http://50.17.237.182/arcgis/rest/services/PIM_v7_0/MapServer';
			var esrijsonFormat = new ol.format.EsriJSON();
            var geojsonFormat = new ol.format.GeoJSON();
			var vectorSource = new ol.source.Vector();
            var geometry = ko.observable(null);
            geometry.subscribe(function (geojsonGeom) {
                vectorSource.clear();
                if (geojsonGeom) {
                    var geom = geojsonFormat.readGeometry(geojsonGeom);
                    vectorSource.addFeature(new ol.Feature(geom));
                }
            });

			var layers = [
				new ol.layer.Tile({
					source: new ol.source.TileArcGISRest({
						url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'
					})
				}),
				new ol.layer.Tile({
					source: new ol.source.TileArcGISRest({
						url: mapserverURL,
						params: {
							layers: 'show:23,24'
						}
					}),
					maxResolution: 2.323339178970923
				}),
				new ol.layer.Vector({
					source: vectorSource
				})
			];
			var map = new ol.Map({
				layers: layers,
				target: el,
				view: new ol.View({
					center: [-13630478.763700977, 4544696.014222133],
					zoom: 12
				})
			});

			map.on('click', function(e) {
				$.getJSON(mapserverURL + '/identify', {
					f: 'json',
					geometry: JSON.stringify({
						"x": e.coordinate[0],
						"y": e.coordinate[1],
						"spatialReference": {
							"wkid": 102100,
							"latestWkid": 3857
						}
					}),
					tolerance: 0,
					returnGeometry: true,
					mapExtent: JSON.stringify({
						"xmin": e.coordinate[0],
						"ymin": e.coordinate[1],
						"xmax": e.coordinate[0],
						"ymax": e.coordinate[1],
						"spatialReference": {
							"wkid": 102100,
							"latestWkid": 3857
						}
					}),
					geometryType: 'esriGeometryPoint',
					sr: 102100,
					layers: 'all:24',
					imageDisplay: '496,1374,96'
				}, function(data) {
					if (data.results.length > 0) {
						var geom = esrijsonFormat.readGeometry(data.results[0].geometry);
                        geom = geojsonFormat.writeGeometry(geom);
                        if (geometry()) {
                            var union = turf.union(
                                {
                                    type: "Feature",
                                    geometry: JSON.parse(geom)
                                }, {
                                    type: "Feature",
                                    geometry: JSON.parse(geometry())
                                }
                            );
                            if (union.geometry.type === 'Polygon') {
                                geometry(JSON.stringify(union.geometry));
                                return
                            }
                        }
                        geometry(geom);
					} else {
                        geometry(null);
                    }
				});
			});
		}
	};
});
