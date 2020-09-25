var instance;
class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super();       
	}
	static getInstance()
	{
		if(instance==undefined || instance == null)
			instance = new EventDispatcher();
		return instance;
	}
}