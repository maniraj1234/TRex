class ScoreTracker {

    ScoreTracker(gameApp) {
        this.gameApp = gameApp;
        this.score = 0;
        this.scoreTrackerInterval = null;
    }
    init = function (eventDispatcher) {
        this.eventDispatcher = eventDispatcher;

        this.eventDispatcher.on(EventsFactory.RESET_EVENT, this.reset.bind(this));
        this.eventDispatcher.on(EventsFactory.START_GAME, this.startGame.bind(this));
        this.eventDispatcher.on(EventsFactory.ON_GAME_OVER, this.gameOver.bind(this));
    }
    reset = function () {
        this.score = 0;
    }
    startGame = function () {
        this.startTracking();
    }
    gameOver = function () {
        this.stopTracking();
    }
    startTracking() {
        if (!this.scoreTrackerInterval) {
            this.scoreTrackerInterval = setInterval(
                function () {
                    score += 1;
                    updateScore(score);
                }.bind(this), 500
            );
        }
    }
    stopTracking() {
        if (this.scoreTrackerInterval)
            clearInterval(this.scoreTrackerInterval);
        this.scoreTrackerInterval = null;
    }
    getScore() {
        return this.score;
    }
}