class ObjectEmitter
{
    constructor(gameApp){
        this.gameApp = gameApp;
        this.objectCount = 0;
    }
    init = function(eventDispatcher)
    {
        this.eventDispatcher = eventDispatcher;
        this.eventDispatcher.on(EventsFactory.RESET_EVENT,this.reset.bind(this));
        this.eventDispatcher.on(EventsFactory.START_GAME,this.startGame.bind(this));
        this.eventDispatcher.on(EventsFactory.ON_GAME_OVER,this.gameOver.bind(this));
    }
    startGame = function()
    {
        this.startEmittingObjects();
    }
    gameOver = function()
    {
        if(this.obstaclesCreater)
            clearInterval(this.obstaclesCreater);
    }
    startEmittingObjects = function(){
        this.obstaclesCreater = setInterval(function(){
            this.emitObject();
        }.bind(this),1800);
    }
    emitObject = function()
    {
        this.objectCount++;
        emitObject(this.objectCount);
    }
    reset = function()
    {
        this.objectCount = 0;
    }
}