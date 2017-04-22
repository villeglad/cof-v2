var L = require('leaflet');
var Draw = require('leaflet-draw');
var bbox = require('geojson-bbox');
var $ = require('jquery');

// create map
var map = L.map('map').setView([60.1699, 24.9384], 13)

// add tile layer to map
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18
}).addTo(map)

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  }
});

map.addControl(drawControl);

// on draw created
map.on('draw:created', function (e) {
  console.log(e)
  console.log(e.layer.editing.latlngs[0][0])
  // polygon to geojson
  var latlngs = e.layer.editing.latlngs[0][0];
  var coords = [];
  for (let value of latlngs) {
    coords.push([value.lat, value.lng])
  }
  coords.push(coords[0]);
  var geojson = {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [coords]
    },
    'properties': {
      'foo': 'bar'
    }
  };
  console.log(geojson)
  map.addLayer(e.layer)
  var details = fetchDetails(geojson)
  console.log(details);
});


function fetchDetails(geojson) {
  $.ajax({
    type: 'POST',
    url: 'https://production-api.globalforestwatch.org/v1/geostore/',
    crossDomain: true,
    data: JSON.stringify({geojson: geojson}),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: true,
    success: function(responseData, textStatus, jqXHR) {
      $.ajax({
        type: 'GET',
        url: 'https://production-api.globalforestwatch.org/v1/umd-loss-gain?geostore=' + responseData.data.id + '&period=2001-01-01%2C2015-12-31&thresh=30',
        crossDomain: true,
        async: false,
        success: function(responseData, textStatus, jqXHR) {
          if (Array.isArray(responseData.data)){
            responseData = {
              data: responseData.data[0]
            }; //why????
          }

          var data = {
            areaHa: responseData.data.attributes.areaHa,
            gain: responseData.data.attributes.gain,
            loss: responseData.data.attributes.loss,
            treeExtent: responseData.data.attributes.treeExtent
          };

          return {
            'area': data.areaHa.toFixed(2),
            'forestCover': data.treeExtent.toFixed(2),
            'forestCoverPercentage': ((data.treeExtent / data.areaHa) * 100).toFixed(2),
            'coverGain': data.gain.toFixed(2),
            'coverLoss': data.loss.toFixed(2),
            'rateOfLoss': ((data.loss - data.gain)/15.0).toFixed(2)
          };
        }
      });
    }
  });
}
var data = {};
$.getJSON("dist/data/foo.json", function(json) {
    console.log(json); // this will show the info it in firebug console
    data = json
});
L.geoJSON(data, {
  style: function (feature) {
      return {color: feature.properties.color};
  }
}).bindPopup(function (layer) {
  return layer.feature.properties.description;
}).addTo(map);

