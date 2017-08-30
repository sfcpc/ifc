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
					source: new ol.source.TileArcGISRest({
						url: settings.basemap
					})
				}),
				new ol.layer.Tile({
					source: new ol.source.TileArcGISRest({
						url: settings.mapserver,
						params: {
							layers: 'show:' + settings.mapserverLayers
						}
					}),
					maxResolution: 2.323339178970923
				}),
				new ol.layer.Vector({
					source: vectorSource
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

			if (geometry()) {
				var geom = geojsonFormat.readGeometry(geometry());
				view.fit(geom, map.getSize())
			}

			if (!readOnly) {
				map.on('click', function(e) {
					$.getJSON(settings.mapserver + '/identify', {
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
						layers: 'all:' + settings.mapserverLayers,
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
				});
			}
		}
	};
});
