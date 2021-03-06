import * as Phaser from 'phaser'

let platforms;
let player; 
let cursors; 
let trash = 12;

export default class GameScene extends Phaser.Scene {

  constructor() {
    super({ key: 'GameScene'})
  }


  preload() {
    this.load.image('img', './img/sky.png');
    this.load.image('ground', './img/platform.png');
    this.load.image('star', './img/star.png');
    this.load.spritesheet('dude', 
    './img/dude.png',
    { frameWidth: 32, frameHeight: 48 });
  }

  create() {

    this.add.image(400,300, 'img');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

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

        this.physics.add.collider(player, platforms);


      let stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 2, y: 0, stepX: 70 }
      });
      
      stars.children.iterate(function (child) {
      
          child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
      
      });

      function collectTrash (player, star)
      {
          star.disableBody(true, true);
          
          trash--;
          console.log(trash);

          if(trash === 0) {
            this.scene.start('TransitionScene');
          }

      }

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectTrash, null, this);

  }

  update() {

    cursors = this.input.keyboard.createCursorKeys();

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

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
  }
}