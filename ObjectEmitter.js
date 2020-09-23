class ObjectEmitter
{
    constructor(gameApp){
        this.gameApp = gameApp;
        this.objectCount = 0;
    }
    startEmittingObjects(){
        this.obstaclesCreater = setInterval(function(){
            this.emitObject();
        }.bind(this),1800);
    }
    emitObject()
    {
        this.objectCount++;
        emitObject(this.objectCount);
    }
}