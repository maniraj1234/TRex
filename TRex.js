var appConfig = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
};
var config = {
       type: Phaser.AUTO,
       width: appConfig.width,
       height: appConfig.height,
       physics: {
           default: 'arcade',
           arcade: {
               gravity: { y: 600 },
               debug: false
           }
       },
       scene: {
           preload: preload,
           create: create,
           update: update
       }
   };
   var uiConfig = {
    rowGap: 15,
    textGroupX: 16
   };
   var player;
   var obstacles;
   var bombs;
   var platforms;
   var cursors;
   var score = 0;
   var gameOver = false;
   var scoreText;
   var bombText;
   var gameOverText;
   var bombCount = 5;
   var button;
   var scoreTracker;
   var objectEmitter;
   var lastTime;
   
   var game = new Phaser.Game(config);
   
   function preload ()
   {
       this.load.image('sky', 'assets/sky.png');
       this.load.image('ground', 'assets/platform.png');
       this.load.image('obstacle', 'assets/obstacle1.png');
       this.load.image('obstacle2', 'assets/obstacle2.png');
       this.load.image('bomb', 'assets/bomb.png');
       this.load.image('leftBound','assets/LeftBound.png');
       this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
   }
   
   function create ()
   {
       
       this.add.image(400, 300, 'sky').setScale(Math.max(appConfig.width/400,appConfig.height/300));
       
       platforms = this.physics.add.staticGroup();
       platforms.create(appConfig.width/2, appConfig.height, 'ground').setScale(appConfig.width/300).refreshBody();
   
       
       player = this.physics.add.sprite(10, config.height - 200, 'dude');
       player.setBounce(0.2);
       player.setCollideWorldBounds(true);
   
       // Our player animations, turning, walking left and walking right.
       this.anims.create({
           key: 'left',
           frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
           frameRate: 10,
           repeat: -1
       });
   
       this.anims.create({
           key: 'turn',
           frames: [ { key: 'dude', frame: 4 } ],
           frameRate: 20
       });
   
       this.anims.create({
           key: 'right',
           frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
           frameRate: 10,
           repeat: -1
       });
   
     
       //physics object groups
       bombs = this.physics.add.group();
       obstacles = this.physics.add.group();

       //start creating obstacles
       objectEmitter = new ObjectEmitter(this);
       objectEmitter.startEmittingObjects();
      
   
   
       //text indicators
       scoreText = this.add.text(uiConfig.textGroupX, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
       bombText = this.add.text(uiConfig.textGroupX, scoreText.y+scoreText.height+uiConfig.rowGap, 'bombs left: '+bombCount, { fontSize: '32px', fill: '#000' });
       //playKeysText = this.add.text(uiConfig.textGroupX, bombText.y+bombText.height+uiConfig.rowGap, 'press keys: up, right, down, space', { fontSize: '32px', fill: '#000' });
       gameOverText = this.add.text(config.width/2, 50, '', { fontSize: '60px', fill: '#000' });
       gameOverText.visible = false;
       scoreTracker = new ScoreTracker(this);
       scoreTracker.startTracking(); 

      
       //collision detection
       this.physics.add.collider(player, platforms);
       this.physics.add.collider(obstacles, platforms);
       this.physics.add.collider(bombs, platforms);
       this.physics.add.collider(obstacles, bombs, onObstacleBombCollision, null, this);
       this.physics.add.overlap(player, obstacles, onPlayerObstacleCollision, null, this);

       
       //  Input Events
       cursors = this.input.keyboard.createCursorKeys();
       //this.input.on('pointerup',onTap);
  
        this.input.on("touchstart", ()=>{
            var clickDelay = this.time.now - lastTime;
            lastTime = this.time.now;
            onTap(clickDelay < 350)
        });
        this.input.on("pointerdown", ()=>{
            var clickDelay = this.time.now - lastTime;
            lastTime = this.time.now;
            onTap(clickDelay < 350)
        });
   }
   function update ()
   {
       
       if (gameOver)
       {
           return;
       };
       if (cursors.left.isDown)
       {
           player.setVelocityX(-160);
           player.anims.play('left', true);
       }
       else if (cursors.right.isDown)
       {
           player.setVelocityX(160);
   
           player.anims.play('right', true);
       }
       else
       {
           player.setVelocityX(0);
   
           player.anims.play('turn');
       }
       if(this.spaceDown && !cursors.space.isDown)
       {
           createBomb();
       }
       this.spaceDown = cursors.space.isDown;
   
       if (cursors.up.isDown && player.body.touching.down)
       {
           player.setVelocityY(-330);
       }
   }
   function onTap(doubleTap){
        if(doubleTap)
            createBomb();
        else
            player.setVelocityY(-330);
   }
   function onPlayerObstacleCollision (player, obstacle)
   {
       this.physics.pause();
       player.setTint(0xff0000);
       player.anims.play('turn');
       gameOver = true;
   
       
       scoreTracker.stopTracking();
       clearInterval(this.obstaclesCreater);
       showGameOver();
       return;
   }
   function showPlayAgain()
   {
    button = game.add.button(appConfig.width/2 - 95, 460, 'button', onPlayAgain, this, 2, 1, 0);
    button.input.useHandCursor = true;
   }
   function emitObject(objCount)
   {
        var obstacleAssetsArr = ['obstacle','obstacle2'];
        var spriteName = obstacleAssetsArr[Math.floor(Math.random() * obstacleAssetsArr.length)];
        var obstacle = this.obstacles.create(appConfig.width, player.y, spriteName);
        //obstacle.setBounce(1);
        obstacle.setCollideWorldBounds(false);
        obstacle.setVelocity(-300, 20);
        obstacle.allowGravity = false;
        objCount++;
        if(objCount%10==0)
        {
            bombCount++;
            bombText.setText('bombs left:'+bombCount);
        }
        if(objCount%5==0)
        {
            var obstaclePower = Math.floor(Math.random() * obstacleAssetsArr.length);
            for(var i=0;i<=obstaclePower;i++)
                objectEmitter.emitObject();
        }
   }
   function createBomb()
   {
       if(bombCount<=0)
        return;
       var x = player.x;
   
       var bomb = this.bombs.create(x, player.y, 'bomb');
       bomb.setBounce(1);
       bomb.setCollideWorldBounds(false);
       bomb.setVelocity(200, 20);
       bomb.allowGravity = false;
       bombCount--;
       bombText.setText('bombs left:'+bombCount);
   }
   function onObstacleBombCollision (obstacle, bomb)
   {
       obstacle.disableBody(true, true);
       bomb.disableBody(true,true);
   
        if (obstacles.countActive(true) === 0)
        {
            //  A new batch of obstacles to collect
            obstacles.children.iterate(function (child) {
        
                child.enableBody(true, child.x, 0, true, true);
        
            });
        }
   }
   function updateScore(score){
    this.scoreText.setText('Score: ' + score);
   }
   
   function showGameOver()
   {
       this.gameOverText.setText('Game Over! :(');
       gameOverText.setX(config.width/2);
       gameOverText.visible = true;
   }
   