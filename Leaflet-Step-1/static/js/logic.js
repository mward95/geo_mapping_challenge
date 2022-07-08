// Create an initial map object
// leaflet overview shows how to setup
var worldMap = L.map('map',{
    center:[0,0],
    zoom: 3
})

// Add a tile layer
// mapbox.com gives the URL template to use with leaflet and StackExchange.com showed the formate on how to add the tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    // API key hidden
    accessToken: API_KEY
}).addTo(worldMap);


// Function to determine circle color based on the magnitude leaflet interactive choropleth map 
// use color.adobe.com to create a color wheel
function getColor(magnitude){
    switch(true){
    
        case (magnitude <= 1):
            return '#1845F5';
            break;
        case (magnitude <= 2):
            return '#00F51D';
            break;
        case (magnitude <= 3):
            return '#E5FA13';
            break;
        case (magnitude <= 4):
            return '#F55D18';
            break;
        case (magnitude <= 5):
            return '#D11BF5';
            break;
        case (magnitude > 5):
            return '#F5000E';
            break;
        default:
            return '#0d0d0d';
            break
    }
}

// Function to determine circle radius based on the magnitude 
// radius of circle leaflet reference 
function getRadius(magnitude){
    switch(true){
        case (magnitude <= 1):
            return 4;
            break;
        case (magnitude <= 2):
            return 7;
            break;
        case (magnitude <= 3):
            return 9;
            break;
        case (magnitude <= 4):
            return 11;
            break;
        case (magnitude <= 5):
            return 14;
            break;
        case (magnitude > 5):
            return 20;
            break;
        default:
            return 1;
            break;
    }
}  
// the geojson used turned to a variable
var GeoJSONUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// Sends http request to the specified url to load .json file or data and executes callback function with parsed json data objects
d3.json(GeoJSONUrl).then(function(data){

    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            // Create a circle marker
            return L.circleMarker(latlng, {
                // different radius for different magnitude
                radius: getRadius(feature.properties.mag), 
                // different circle colors for different magnitude
                fillColor: getColor(feature.properties.mag), 
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // popup text when you click on each earthquake
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(worldMap);
    
    // Create a legend
    var legend = L.control({position: 'topright'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5]
        
        div.innerHTML += "<h4>Magnitude Level</h4><hr>"
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(worldMap);
});