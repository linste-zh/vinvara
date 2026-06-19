import {experimentData, scale, settings} from './results.js';
import {videoShown, videoPicked, timeStamp, updateTimeStamp} from './video.js'
import {pickFile, readFileAsText} from "../importAndExport/importFiles.js"
import {DataPoint} from '../DataPoint.js'

const intervalValues = []
const timestampValues = []
const ratingValues = []
var chart = null

function requestGraph(){
    let cnt = document.getElementById("graphContainer")
    cnt.innerHTML = "Select Graph"
}

function createGraph(){
    let cnt = document.getElementById("graphContainer")
    cnt.innerHTML = "<canvas id='resultChart'></canvas>"

    var inputs = experimentData["dataInputs"]

    for (var i in inputs){
        intervalValues.push(inputs[i].associatedInterval)
        timestampValues.push(inputs[i].timeOfRating)
        ratingValues.push(inputs[i].rating)
    }

    document.getElementById("intervalButton").click()
}

async function loadGraph(){
    console.log("clicked")

    const resFileSrc = await pickFile(".csv")
    readFileAsText(resFileSrc).then(function(value) {
        const dataPoints = readDataPointsCSV(value)
        experimentData["dataInputs"] = dataPoints

        createGraph()
    })
}

function readDataPointsCSV(text){
    text = text.replace(/\n/g, "")
    const csvRows = text.split("\r")
    var dataPoints = new Array()

    for(var row in csvRows){
        var rowCells = csvRows[row].split(",")
        if(!isNaN(parseFloat(rowCells[0])) && isFinite(rowCells[0])){
            dataPoints.push(new DataPoint(rowCells[0], rowCells[1], rowCells[2]))
        }
    }

    return dataPoints
}


function showGraph(variable = intervalValues){
    if (chart) {
        chart.destroy();
    }

    if(scale == null){
        
    }

    var middle_rating = scale[Math.floor(Object.values(scale).length / 2)]
    var lastDataPoint = experimentData[Object.values(experimentData).length - 1]
    var maxX = Math.ceil(settings["videoDuration"])

    if(Object.values(scale).length % 2 != 0){
        var middle = middle_rating["value"];
    }else{
        var middle = middle_rating["value"] - 0.5;
    }

    //largely done via ChatGPT
    Chart.register(
        window['chartjs-plugin-annotation'],
        Chart.LineController,
        Chart.LineElement,
        Chart.PointElement,
        Chart.LinearScale,
        Chart.TimeScale,
        Chart.CategoryScale,
        Chart.Title,
        Chart.Tooltip,
        Chart.Legend
    );    

    Chart.register({
        id: 'whiteBackground',
        beforeDraw(chart) {
            const ctx = chart.canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chart.width, chart.height);
        }
    });


    const ctx = document.getElementById("resultChart").getContext('2d')
    chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: intervalValues,
          datasets: [{
            label: experimentData["userName"] + " rating " + experimentData["lingVar"],
            borderColor: "rgba(0, 0, 0, 0.47)",
            data: variable.map((t, i) => ({ x: t, y: ratingValues[i] })),
            fill: true,
            clip: false,
          }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: maxX
                },
                y: {
                    min: scale[0]["value"],
                    max: scale[Object.values(scale).length - 1]["value"],
                    ticks: {
                        stepSize: 1,
                    },
                    grid: {
                        drawBorder: false
                    },
                    offset: true,
                }
            },
            events: ['mousemove', 'mouseout', 'click'],
            onClick: function(e, elements, chart) {
                const canvasPosition = Chart.helpers.getRelativePosition(e, chart);
                const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);

                updateTimeStamp(dataX)
                chart.options.plugins.annotation.annotations.timestampLine.value = timeStamp;
                chart.update()

                if (videoShown && videoPicked) {
                    document.getElementById('video_player').currentTime = timeStamp;
                }
            },
            plugins: {
                annotation: {
                    interaction: {
                        mode: 'x',
                        intersect: false
                    },
                    events: ["click"],
                    annotations: {
                        middleLine: {
                            type: "line",
                            yMin: middle,
                            yMax: middle,
                            borderColor: "black",
                            borderWidth: 2
                        },
                        timestampLine: {
                            type: 'line',
                            mode: 'vertical',
                            scaleID: 'x',
                            value: timeStamp,
                            borderColor: '#74d4f8',
                            borderWidth: 1.5,
                            display: false
                        }
                    }
                }
            }
        }
    })

    if (videoShown && videoPicked) {
        chart.options.plugins.annotation.annotations.timestampLine.display = true
        chart.update()
    }
}

function refresh(){
    if(chart != null){
        chart.resize();
        chart.update();
    }
}


function toggleGraph(button){
    var ib = document.getElementById("intervalButton")
    var tsb = document.getElementById("timestampButton")
    if(button == "interval"){
        ib.classList.add("activeOption")
        tsb.classList.remove("activeOption")
        showGraph(intervalValues)
    }else if (button == "timestamp"){
        tsb.classList.add("activeOption")
        ib.classList.remove("activeOption")
        showGraph(timestampValues)
    }
}

export{
    chart,
    requestGraph,
    showGraph,
    refresh,
    createGraph,
    toggleGraph,
    loadGraph
}