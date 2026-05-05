const intervalValues = []
const timestampValues = []
const ratingValues = []
const experimentData = JSON.parse(localStorage.getItem("experimentDataObject"))
const scale = JSON.parse(localStorage.getItem("scaleObject"))
const settings = JSON.parse(localStorage.getItem("settingsObject"))
var videoShown = false
var videoPicked = false
var timeStamp = 0
var chart

function setUp(){
    if(experimentData == null){
        console.log("No data found")
    }else{
        inputs = experimentData["dataInputs"]
        console.log(experimentData["dataInputs"])

        for (var i in inputs){
            intervalValues.push(inputs[i].associatedInterval)
            timestampValues.push(inputs[i].timeOfRating)
            ratingValues.push(inputs[i].rating)
        }

        document.getElementById("intervalButton").click()
    }    


    document.getElementById("videoContainer").style.display = "none"

    window.addEventListener("beforeunload", function(e){
        if(!confirm("Are you sure you want to leave the page?")){
            e.preventDefault()
        }
    })

    //specifically for safari
    window.addEventListener("pagehide", function(e){
        if(!confirm("Are you sure you want to leave the page?")){
            e.preventDefault()
        }
    })

    toggleVideo()
}

//source: https://medium.com/@idorenyinudoh10/how-to-export-data-from-javascript-to-a-csv-file-955bdfc394a9
function createCSV(){
    inputs = experimentData["dataInputs"]

    //create headers
    const titleKeys = Object.keys(inputs[0])

    //add headers to dataset
    const refinedData = []
    refinedData.push(titleKeys)

    //add data to dataset
    inputs.forEach(dp => {
        refinedData.push(Object.values(dp))  
    })

    let csvContent = ''

    //turn dataset into CSV format
    refinedData.forEach(row => {
        csvContent += row.join(',') + '\n'
    })

    csvLink = document.getElementById("csvLink")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
    csvURL =  URL.createObjectURL(blob)
    csvLink.setAttribute('href', csvURL)

    currentDate = new Date()
    const fileName = `${currentDate.getFullYear()}/${currentDate.getMonth()+1}/${currentDate.getDate()}_${experimentData["userName"]}_${experimentData["lingVar"]}`

    csvLink.setAttribute('download', fileName)
}

function createJpeg(){
    var canvas = document.getElementById("resultChart");
    var canvasUrl = canvas.toDataURL("image/jpeg");

    jpegLink = document.getElementById("jpegLink")
    jpegLink.setAttribute('href', canvasUrl)

    currentDate = new Date()
    const fileName = `${currentDate.getFullYear()}/${currentDate.getMonth()+1}/${currentDate.getDate()}_${experimentData["userName"]}_${experimentData["lingVar"]}`
    jpegLink.setAttribute('download', fileName)
}