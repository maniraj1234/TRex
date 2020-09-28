class GameOverView {
    constructor(gameApp) {
        this.gameApp = gameApp;
        this.gameOverText = null;
        this.gameOverView = this.gameApp.add.container(0, 0);
    }
    init = function (eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
        this.eventDispatcher.on(EventsFactory.RESET_EVENT, this.reset.bind(this));
        this.eventDispatcher.on(EventsFactory.ON_GAME_OVER, this.gameOver.bind(this));
    }
    gameOver = function () {
        this.gameOverText = this.gameApp.add.text(config.width / 2, 50, 'Game Over! :(', { fontSize: '60px', fill: '#000' });
        this.gameOverText.anchor = 0.5;
        this.gameOverView.add(this.gameOverText);

        this.playAgainText = this.gameApp.add.text(config.width / 2, 120, 'PLAY AGAIN 🔄', { fontSize: '80px', fill: '#000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onClickPlayAgain());

        this.gameOverView.visible = true;

    }
    onClickPlayAgain = function () {
        this.gameOverView.visible = false;
        this.eventDispatcher.emit(EventsFactory.ON_CLICK_PLAY_AGAIN);
    }
    reset = function () {
        this.gameOverView.visible = false;
    }

}