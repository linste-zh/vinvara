import {setUp, createCSV, createJpeg} from './results.js'

window.addEventListener("DOMContentLoaded", setUp)
window.setUp = setUp

document.getElementById("csvLink").addEventListener("click", createCSV)
window.createCSV = createCSV

document.getElementById("jpegLink").addEventListener("click", createJpeg)
window.setUpVideo = setUpVideo


import {toggleGraph, refresh, loadGraph} from './graph.js'

window.addEventListener("DOMContentResize", refresh)
window.refresh = refresh

document.getElementById("intervalButton").addEventListener("click", () => {toggleGraph('interval')})
document.getElementById("timestampButton").addEventListener("click", () => {toggleGraph('timestamp')})
window.toggleGraph = toggleGraph

document.getElementById("uploadCSV").addEventListener("click", loadGraph)
window.loadGraph = loadGraph


import {toggleVideo, setUpVideo} from './video.js'

document.getElementById("showVideo").addEventListener("click", toggleVideo)
window.toggleVideo = toggleVideo

document.getElementById("setUpButton").addEventListener("click", setUpVideo)
window.setUpVideo = setUpVideo
