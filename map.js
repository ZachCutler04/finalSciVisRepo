import * as d3 from "d3";

export function createMap(data, date, latitude, longitude){

  d3.select("#map").selectAll('*').remove();

  //Create the overlay that we will draw on
  let overlay = new google.maps.OverlayView();

  //The second parameter we want to use is the zoom and center(lat and lng) options for the map
  let options = {
      center: {lat: latitude, lng: longitude}, // Missoula, MT
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.TERRAIN
      // mapTypeId: 'terrain' //This is optional and changes the type of google map shown.
  };
  //Create a new google map object
  let map = new google.maps.Map(d3.select("#map").node(), options);

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function () {

      let layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
          .attr("class", "sensors");

      overlay.onRemove = function () {
          d3.select('.sensors').remove();
      };

      overlay.draw = function () {

        let projection = this.getProjection(),
            padding = 10;

        let circleScale = d3.scaleLinear()
            .domain([d3.min(d3.range(0, data[date].length), d => data[date][d]["PM1.0 (ATM)"]),
                d3.max(d3.range(0, data[date].length), d => data[date][d]["PM1.0 (ATM)"])])
            .range([2, 7]).clamp(true);

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        let marker = layer.selectAll('svg')
            .data(d3.range(0, data[date].length));

        let markerEnter = marker.enter().append("svg");

        // add the circle
        markerEnter.append("circle");

        marker.exit().remove();

        marker = marker.merge(markerEnter);

        marker
            .each(transform)
            .attr("class", "marker");

        // style the circle
        marker.select("circle")
            .attr("r", d => circleScale(data[date][d]["PM1.0 (ATM)"]))
            .attr("cx", padding)
            .attr("cy", padding)
            .style('opacity', .8)
            .attr('fill', d => {
                return 'cornflowerblue';
            })
            .on('click', d => console.log(d));

        //transforms the markers to the right
        // lat / lng using the projection from google maps
        function transform(d) {
            let latLon = new google.maps.LatLng(data[date][d]["lat"], data[date][d]["lon"]);

            latLon = projection.fromLatLngToDivPixel(latLon);

            return d3.select(this)
                .style("left", (latLon.x - padding) + "px")
                .style("top", (latLon.y - padding) + "px");
        }
    };

    // Bind our overlay to the map…

  };

  overlay.setMap(map);


}
