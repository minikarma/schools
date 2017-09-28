mapboxgl.accessToken = 'pk.eyJ1IjoidXJiaWNhIiwiYSI6ImNpamFhZXNkOTAwMnp2bGtxOTFvMTNnNjYifQ.jUuvgnxQCuUBUpJ_k7xtkQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', //hosted style id
    center: [37.61707,55.74880], // starting position
    zoom: 12,
    pitch: 0,
    bearing: 0
});

var panel = d3.select("#panel"),
    panelHeader = d3.select("#panelHeader"),
    panelText = d3.select("#panelText");

var schoolStyle = {
  "id": "schools",
  "type": "circle",
  "source": "schools",
  "filter": [">=", "passed_over_220_percent", 0],
  "paint": {
    "circle-color": {
      "property": "passed_over_220_percent",
      "type": "interval",
      "stops": [
        [0, "#D0021B"],
        [20, "#FDA623"],
        [40, "#ECDD1C"],
        [60, "#7ED321"],
        [80, "#417505"]
      ]
    },
    "circle-radius": {
      "stops": [
        [10, 3.5],
        [15, 16]
      ]
    }
  }
};


var schoolStyleSelected = {
  "id": "schoolsSelected",
  "type": "circle",
  "source": "schools",
  "filter": ["==", "global_id", 0],
  "paint": {
    "circle-color": "#000fff",
    "circle-radius": {
      "stops": [
        [10, 5],
        [15, 20]
      ]
    }
  }
};

var schoolStyleText = {
  "id": "schoolsText",
  "type": "symbol",
  "source": "schools",
  "filter": [">=", "passed_over_220_percent", 0],
  "layout": {
    "text-field": "{passed_over_220_percent}",
    "text-size": {
      "stops": [
        [13,9],
        [15,13]
      ]
    },
    "text-offset": [0,0],
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"]
  },
  "paint": {
    "text-color": "#fff",

    "text-opacity": {
      "stops": [
        [12.5,0],
        [13,1]
      ]
    }

  }
};

mapClick = (e) => {
    // set bbox as 5px rectangle area around clicked point
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = map.queryRenderedFeatures(bbox, { layers: ['schools'] });

    if(features.length>0) {
      panel.style("display", "block");
      var f = features[0].properties;
      panelHeader.text(f.ShortName);
      panelText.html("Всего сдававших: " + f.passed_total

        + "<br/>Сдавших выше 220 балов:" + f.passed_over_220 + "(" + f.passed_over_220_percent +"%)"
        + "<br/>Сдавших выше 160 балов:" + f.passed_under_160 + "(" + f.passed_under_160_percent +"%)"
        + "<br/><a href='https://"+f.WebSite+"'>"+f.WebSite+"</a>");
      map.setFilter("schoolsSelected", ["==", "OGRN", f.OGRN]);

    } else {
      panel.style("display", "none");
      map.setFilter("schoolsSelected", ["==", "OGRN", 0]);
    }

}


map.on('load', ()=> {
  map.addSource("schools", { type: "geojson", data: "schools.geojson"});
  map.addLayer(schoolStyleSelected);

//  map.addLayer(schoolStyleValue);
  map.addLayer(schoolStyle);
map.addLayer(schoolStyleText);
  map.on('click', mapClick);

  console.log(map.getStyle());

});
