class DataPoint{
    constructor(time, interval, rating){
        this.timeOfRating = time;
        this.associatedInterval = interval;
        this.rating = rating;
    }
}

export{
    DataPoint
}