import {createMap} from '../src/map.js'
import {createLineChart} from '../src/lineChart.js'
import {createScatterplot} from '../src/scatterplot.js'

import * as d3 from "d3";

let currData = undefined;
let currDate = "2019-01-01";
let currLat = 40.7618;
let currLong = -111.891;
let currPm = 'PM2.5 (ATM)';

let slcData = undefined;
let denverData = undefined;
let laData = undefined;
let minneapolisData = undefined;

let totalElevationScale = [];

let totalPM1 = [];
let totalPM2 = [];
let totalPM10 = [];


export function updateAll(newData, newDate, newLat, newLong)
{
  currData = newData;
  currDate = newDate;
  currLat = newLat;
  currLong = newLong;
}

export function recreateMap()
{
  if(currPm.includes('2.5'))
  {
    createMap(currData, currDate, currLat, currLong, currPm, totalPM2);
    createScatterplot(currData, currDate, currLat, currLong, currPm, totalPM2, totalElevationScale);
  }
  else if (currPm.includes('1.0'))
  {
    createMap(currData, currDate, currLat, currLong, currPm, totalPM1);
    createScatterplot(currData, currDate, currLat, currLong, currPm, totalPM1, totalElevationScale);
  }
  else{
    createMap(currData, currDate, currLat, currLong, currPm, totalPM10);
    createScatterplot(currData, currDate, currLat, currLong, currPm, totalPM10, totalElevationScale);
  }

}


d3.json("../data/slc.json").then(function(slcD){
  d3.json("../data/denver.json").then(function(denverD){
    d3.json("../data/la.json").then(function(laD){
      d3.json("../data/minneapolis.json").then(function(minneapolisD){

        let listData = [slcD, denverD, laD, minneapolisD];

        for(let i of listData)
        {
          for(let j in i)
          {
            for(let k in i[j])
            {
              if(i[j][k].elevation !== undefined && !isNaN(+i[j][k]["PM1.0 (ATM)"]) &&  i[j][k]["PM1.0 (ATM)"] !== null &&  i[j][k]["PM1.0 (ATM)"] !== undefined && +i[j][k]["PM1.0 (ATM)"] <= 100
              && !isNaN(+i[j][k]["PM2.5 (ATM)"]) &&  i[j][k]["PM2.5 (ATM)"] !== null &&  i[j][k]["PM2.5 (ATM)"] !== undefined && +i[j][k]["PM2.5 (ATM)"] <= 100
              && !isNaN(+i[j][k]["PM10.0 (ATM)"]) &&  i[j][k]["PM10.0 (ATM)"] !== null &&  i[j][k]["PM10.0 (ATM)"] !== undefined && +i[j][k]["PM10.0 (ATM)"] <= 100)
              {
                totalElevationScale.push(i[j][k].elevation)
                totalPM1.push(i[j][k]["PM1.0 (ATM)"])
                totalPM2.push(i[j][k]["PM2.5 (ATM)"])
                totalPM10.push(i[j][k]["PM10.0 (ATM)"])
              }
              else{
                console.log(i[j][k])
                delete i[j][k]
              }
            }
          }
        }

        console.log(totalElevationScale);
        console.log(totalPM1);
        console.log(totalPM2);
        console.log(totalPM10);

        // for(let i = 0; i < totalElevationScale.length; i++)
        // {
        //   if(totalElevationScale[i] > 1000)
        //   {
        //     totalElevationScale.splice(i, 1);
        //     i--;
        //   }
        // }
        //
        // for(let i = 0; i < totalPM1.length; i++)
        // {
        //   if(totalPM1[i] > 1000)
        //   {
        //     totalPM1.splice(i, 1);
        //     i--;
        //   }
        // }
        //
        // for(let i = 0; i < totalPM2.length; i++)
        // {
        //   if(totalPM2[i] > 1000)
        //   {
        //     totalPM2.splice(i, 1);
        //     i--;
        //   }
        // }
        //
        // for(let i = 0; i < totalPM10.length; i++)
        // {
        //   if(totalPM10[i] > 1000)
        //   {
        //     totalPM10.splice(i, 1);
        //     i--;
        //   }
        // }

        console.log(Math.max(totalPM2))

        totalElevationScale = [d3.min(totalElevationScale), d3.max(totalElevationScale)]
        totalPM1 = [d3.min(totalPM1), 100]
        totalPM2 = [d3.min(totalPM2), 100]
        totalPM10 = [d3.min(totalPM10), 100]


        //This was code to get elevatuon. DO NOT UNCOMMENT, I will lose money to google!!!

        // let latLngList = [];
        //
        // for(let i in laD)
        // {
        //   for(let j of laD[i])
        //   {
        //     if(!(latLngList.some(d => d.lat === j.lat) && latLngList.some(d => d.lng === j.lon)))
        //     {
        //       latLngList.push({lat: +j.lat, lng: +j.lon})
        //     }
        //   }
        // }
        //
        // let returnedList = [];
        //
        //
        // let elevator = new google.maps.ElevationService;
        //
        // elevator.getElevationForLocations({
        //   'locations': latLngList.slice(300, 596)
        // }, function(results, status, error_message) {
        //
        //   for(let i in laD)
        //   {
        //     for(let j of laD[i])
        //     {
        //       for(let k of results)
        //       {
        //
        //         if(j.lat.toFixed(3) == k.location.lat().toFixed(3) && j.lon.toFixed(3) == k.location.lng().toFixed(3))
        //         {
        //           j['elevation'] = k.elevation
        //         }
        //       }
        //     }
        //   }
        // });

        slcData = slcD;
        laData = laD;
        denverData = denverD;
        minneapolisData = minneapolisD;

        currData = slcData;

        createMap(slcData, '2019-01-01', 40.7618, -111.891, currPm, totalPM2);
        createScatterplot(slcData, '2019-01-01', 40.7618, -111.891, currPm, totalPM2, totalElevationScale);

        createLineChart(slcData, denverData, laData, minneapolisData, currPm);

        d3.select('#slcClass0').classed('selectedDot', true);
      });
    });
  });
});

d3.select("#pdLevel").on('change',()=>{
  let val = (document.getElementById('pdLevel')).value;
  currPm = val;
  recreateMap();
  createLineChart(slcData, denverData, laData, minneapolisData, currPm);

})
