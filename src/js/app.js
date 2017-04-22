var L = require('leaflet');
var $ = require('jquery');
var draw = require('./map');


var popup = L.popup().setContent('<p>Hello world!<br />This is a nice popup.</p>');

// map.on('click', (e) => {
//   $('.sidebar').css('flex', '2')
//   $('.hide-sidebar').show();
//   var geojson = pointToGeoJsonCircle(e.latlng)
//   //var details = fetchDetails(geojson);
//   //renderSidebar(details);
// });

// listen for hide sidebar event
$('.hide-sidebar').click(() => {
  $('.sidebar').css('flex', '0')
  $('.hide-sidebar').hide();
})

function renderSidebar(data) {
  var info = JSON.stringify(data);
  $('#sidebar').append(info)
}

