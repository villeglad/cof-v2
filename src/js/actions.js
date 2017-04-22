export default function fetchDetails(geojson) {
  $.ajax({
    type: 'POST',
    url: 'https://production-api.globalforestwatch.org/v1/geostore/',
    crossDomain: true,
    data: JSON.stringify({geojson: geojson}),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
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
