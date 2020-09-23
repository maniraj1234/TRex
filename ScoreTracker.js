class ScoreTracker
{
    
    ScoreTracker(gameApp){
        var gameApp = gameApp;
        var score = 0;
        var scoreTrackerInterval;
    }
    startTracking(){
        this.scoreTrackerInterval = setInterval(
            function()
            {
                score +=1;
                updateScore(score);
            }.bind(this),500
        );
    }
    stopTracking(){
        clearInterval(this.scoreTrackerInterval);
    }
    getScore(){
        return this.score;
    }
}