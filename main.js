import {createMap} from './map.js'
import {createLineChart} from './lineChart.js'
import * as d3 from "d3";


d3.json("data/slc.json").then(function(slcData){
  d3.json("data/denver.json").then(function(denverData){
    d3.json("data/la.json").then(function(laData){
      d3.json("data/minneapolis.json").then(function(minneapolisData){
        createMap(slcData, '2019-01-01', 40.7618, -111.891);
        createLineChart(slcData, denverData, laData, minneapolisData);
      });
    });
  });
});
