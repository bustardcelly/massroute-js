define(['com/custardbelly/massroute/model/InflatableModel'], function( InflatableModel ) {
	
	var StopPrediction = (function() {
        this.seconds = 0;
        this.minutes = 0;
        this.epochTime = '';
        this.isDeparture = false;
        this.dirTag = '';
        this.affectedByLayover = false;
        this.delayed = false;
        this.slowness = 0;
    });
    
    StopPrediction.prototype = new InflatableModel();
    StopPrediction.prototype.constructor = StopPrediction;

    return StopPrediction;
});