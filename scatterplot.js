import * as d3 from "d3";

export function createScatterplot(data, date, latitude, longitude, pmLevel, pmScale, elevationScale)
{

  console.log(pmScale);
  d3.select("#scatterplot").selectAll('*').remove();

  // set the dimensions and margins of the graph
  console.log(d3.select("#scatterplot").node().clientWidth)
  var margin = {top: 50, right: 50, bottom: 50, left: 50};
  let width = d3.select("#scatterplot").node().clientWidth - margin.left - margin.right;
  let height = d3.select("#scatterplot").node().clientHeight - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#scatterplot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  let listOfElevation = [];
  let listOfPm = [];
  let listOfLabels = [];
  let listOfRealLabels = [];


  for(let i of data[date])
  {
    if(i !== undefined && i[pmLevel] !== null && i.elevation !== undefined)
    {
      listOfLabels.push(i.id);

      listOfElevation.push(i.elevation);
      listOfPm.push(i[pmLevel]);
      listOfRealLabels.push(i.label)
    }
  }

  let colorScale = d3.scaleSequential(d3.interpolateReds)
      .domain(pmScale)

  // Add X axis
  var x = d3.scaleLinear()
    .domain([d3.min(listOfElevation), d3.max(listOfElevation)])
    .range([ 0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain(pmScale)
    .range([ height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

    // text label for the x axis
svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height + margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .text("Elevation");

    // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(pmLevel.substring(0,6));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(d3.range(0, listOfPm.length))
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(listOfElevation[d]); } )
      .attr("cy", function (d) { return y(listOfPm[d]); } )
      .attr("class", 'scatterNorm')
      .attr("r", 3)
      .attr('id', d => 'a' + listOfLabels[d] +'scat')
      .on('mouseover', (d) => {
        d3.select("#scatterplotTooltip").transition().duration(200).style("opacity", .9);
        d3.select("#scatterplotTooltip").html("<h5>Label: " +listOfRealLabels[d] + "<h5>Elevation: " + listOfElevation[d].toFixed(2) + "</h5><h5>PM: "  + listOfPm[d] +  "</h5>")
          .style("left", (d3.event.pageX + 14) + "px")
          .style("top", (d3.event.pageY - 40) + "px");

        d3.selectAll('.hoverMap').classed('hoverMap', false)
        d3.select('#a' + listOfLabels[d]).classed('hoverMap', true);

        d3.selectAll('.hoverScatter').classed('hoverScatter', false)
        d3.select('#a' + listOfLabels[d]+ 'scat').classed('hoverScatter', true);
      })
      .on('mouseout', (d) => {
        d3.select("#scatterplotTooltip").transition().duration(200).style("opacity", 0);

        d3.selectAll('.hoverMap').classed('hoverMap', false)
        d3.selectAll('.hoverScatter').classed('hoverScatter', false)

      })
      .style('fill', d => colorScale(listOfPm[d]))


}
