// ***open with live server***
// Function for creating map
function createMap(GeoJsonLayer, platesLayer){
    // Add multiple tile layers
    // The satellite imagery represents a blend of commercial and government providers
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    })
// n addition to a great roads network, this map does an excellent job at showing trail networks.
    var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    })
// Mapbox has stripped away the noise resulting in minimal styles that have just enough context to assist in the spatial story you are trying to tell.
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    })
// Mapbox has stripped away the noise resulting in minimal styles that have just enough context to assist in the spatial story you are trying to tell.
    var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    })
// The map style features clear roadways, administrative boundaries, and points of interest.
    var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    })
    
    // Create a baseMaps object
    var baseMaps = {
        Satellite: satelliteMap,
        Outdoors: outdoorsMap,
        Light: lightMap,
        Dark: darkMap,
        Street:streetMap
    }


    // Create an overlayMaps object
    var overlayMaps = {
        'Fault Lines': platesLayer,
        Earthquakes: GeoJsonLayer
    }
    // Define a myMap object
    var myMap = L.map('map',{
        center:[0,0],
        zoom: 2,
        layers: [satelliteMap, platesLayer, GeoJsonLayer]
    })
    
    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
    return myMap;
}

// Function for creating GeoJSON layer
function createGeoJsonLayer(data){
    var GeoJsonLayer = L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    })
    return GeoJsonLayer;
}

// Function for creating legend
function createLegend(map){
    // Create a legend
    var legend = L.control({position: 'topright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0,1, 2, 3, 4, 5]
        div.innerHTML += "<h4>Magnitude Level</h4><hr>"
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
}



// Function to determine circle color based on the magnitude 
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

// File path for the Data on tectonic plates
var platesJsonPath = "static/data/PB2002_plates.json"
d3.json(platesJsonPath).then(function(platesData){
    var platesLayer = L.geoJson(platesData,{
        style: function(feature) {
            return {
                color: "#F0ED0E",
                fillColor: "white",
                fillOpacity:0
            };
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<span>Plate: ${feature.properties.PlateName}</span>`)
        }
    })
    
    var GeoJSONUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
    d3.json(GeoJSONUrl).then(function(earthquakeData){
        
        var GeoJsonLayer = createGeoJsonLayer(earthquakeData);
        var myMap = createMap(GeoJsonLayer,platesLayer);
        createLegend(myMap)
});
})