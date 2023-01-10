// Global Phaser 

const gameScene = new Phaser.Scene('Game');
var platforms;
var player;
var keys;
var stars;
var bombs;
var txtScore, score=0;

gameScene.preload = function() {
    gameScene.load.image('background', 'assets/sky.png');
    gameScene.load.image('platform', 'assets/platform.png');
    gameScene.load.image('star','assets/star.png');
    gameScene.load.image('bomb', 'assets/bomb.png');

    gameScene.load.spritesheet('player','assets/dude.png',{frameWidth: 32,frameHeight: 48});
}

gameScene.create = function() {
    keys = gameScene.input.keyboard.createCursorKeys();
    
    var bg = gameScene.add.sprite(0,0,'background').setPosition(800/2,600/2);
    
    platforms = this.physics.add.staticGroup();
    var platform = platforms.create(0,570,'platform').setScale(4,2).refreshBody();
    
        platform = platforms.create(600,425,'platform');
    
        platform = platforms.create(50,300,'platform');
    
        platform = platforms.create(700,220,'platform');
    
    //**************************************************************\\
    
    stars = this.physics.add.group();
    stars.enableBody = true;
    
    this.physics.add.collider(stars, platforms);
    
    for(var i = 0; i < 12; i++) {
        var star = stars.create(i*62+40,10,'star');
            star.setBounce(0.7 + (Math.random()*0.2));
    }
    
    //**************************************************************\\ 
    
    player = this.physics.add.sprite(75, 450,'player').setScale(1.25).refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
    //player.body.gravity.x = 200;

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [{key: 'player', frame: 4}],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });
    
    //**************************************************************\\

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    
    //****************************************************************\\
    
    txtScore = gameScene.add.text(16,16,'SCORE: 0',{fontSize: '48px', fill: '#fff'})
}

gameScene.update = function() {
    
    //player.body.velocity.y = 0;
    gameScene.physics.add.overlap(player, stars, collectStar);
    
    
    if (keys.left.isDown) {
        player.body.velocity.x = -150;
        player.anims.play('left', true);
    }
    else if (keys.right.isDown) {
        player.body.velocity.x = 150;
        player.anims.play('right', true);
    }
    else {
        player.body.velocity.x = 0;
        player.anims.play('turn');
    }
    
    if (keys.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -330;
    }
  
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    txtScore.text = 'SCORE: ' + score;
    

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        
        var bomb = bombs.create(x, 16, 'bomb').setScale(1.25);
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    txtScore.text = 'SCORE: ' + score + ' - GAME OVER!';

    gameOver = true;
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300 },
            debug: false,
        }
    },
    //backgroundColor: 0x5f6e7a,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: gameScene
};

const game = new Phaser.Game(config);
