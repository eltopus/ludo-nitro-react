/*eslint-disable */
import "phaser";
import {PieceFactory} from './pieceFactory'
import {Die} from './die'
import {Dice} from './dice'
import {SideSceneEmitter} from './sideSceneEmmiter'
//const axios = require('axios').default;



export class GameScene extends Phaser.Scene {
  info: any;
  currentPlayer: any = null
  rule: any;
  paths: any = null
  sendOnce = true
  ludo: any
  die1Score: Phaser.GameObjects.Text;
  die2Score: Phaser.GameObjects.Text;
  displayPlayerName: Phaser.GameObjects.Text;
  emitter: SideSceneEmitter
  dice: Dice
  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(/*params: any*/): void {
    this.cameras.main.setViewport(0, 0, 1020, 721);
  }

  preload(): void {

    this.load.image("board", 'http://localhost:3001/board.jpg');
    this.load.image('red1', 'http://localhost:3001/red.png');
    this.load.image('red2', 'http://localhost:3001/red.png');
    this.load.image('red3', 'http://localhost:3001/red.png');
    this.load.image('red4', 'http://localhost:3001/red.png');

    this.load.image('blue1', 'http://localhost:3001/blue.png');
    this.load.image('blue2', 'http://localhost:3001/blue.png');
    this.load.image('blue3', 'http://localhost:3001/blue.png');
    this.load.image('blue4', 'http://localhost:3001/blue.png');

    this.load.image('yellow1', 'http://localhost:3001/yellow.png');
    this.load.image('yellow2', 'http://localhost:3001/yellow.png');
    this.load.image('yellow3', 'http://localhost:3001/yellow.png');
    this.load.image('yellow4', 'http://localhost:3001/yellow.png');

    this.load.image('green1', 'http://localhost:3001/green.png');
    this.load.image('green2', 'http://localhost:3001/green.png');
    this.load.image('green3', 'http://localhost:3001/green.png');
    this.load.image('green4', 'http://localhost:3001/green.png');

    this.load.spritesheet('die1', 'http://localhost:3001/dice.png', { frameWidth: 69, frameHeight: 69, endFrame: 5 })
    this.load.spritesheet('die2', 'http://localhost:3001/dice.png', { frameWidth: 69, frameHeight: 69, endFrame: 5 })
    this.load.image('rollDice', 'http://localhost:3001/rollDice.png')
    
  }

  create(): void {
    this.emitter = new SideSceneEmitter(this)
    this.add.image(361, 361, 'board')  
    let pieceFactory = new PieceFactory(this, null)
    let redPieces = pieceFactory.createRedPieces()
    let bluePieces = pieceFactory.createBluePieces()
    let yellowPieces = pieceFactory.createYellowPieces()
    let greenPieces = pieceFactory.createGreenPieces()

    let graphics = this.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeRoundedRect(723, 1, 300, 721, 32);
    graphics.strokeRoundedRect(723, 300, 300, 120, 32);
    let rollDice = this.add.sprite(950, 500, 'rollDice')
    rollDice.setScale(0.2, 0.2)
    rollDice.setInteractive()
    let data = this.cache.json.get('data');
    let dieFrame1 = 0
    let dieFrame2 = 0
  
    let die1 = new Die(this, 820, 360, dieFrame1, 'die1')
    let die2 = new Die(this, 920, 360, dieFrame2, 'die2')
    
    this.dice = new Dice(this)
    
    this.dice.addDice(die1)
    this.dice.addDice(die2)
    
  
    rollDice.on('pointerdown', (pointer: any) => {
      let value1 =  Phaser.Math.Between(1, 6)
      let value2 =  Phaser.Math.Between(1, 6)
      value1 = 6
      value2 = 4
      this.emitter.emmitDiceRoll(value1, value2)
    });

    
     this.die1Score = this.add.text(780, 200, "dieOne: 0")
     this.die2Score = this.add.text(880, 200, "dieTwo: 0")

     this.displayPlayerName = this.add.text(750, 150, "CurrentPlayer: " + this.registry.get('currentPlayer'))
     this.registry.events.on('changedata', this.updateScore,  this)
     

    if (data){
      this.dice.setDieValue(data.dice)
    }
    
  
  }  
  update(time: number): void {
    for (let die of this.dice.dice){
      if (die.hasValue()){
        die.alpha = 1
      }else {
        die.alpha = 0.5
      }
    }
  }

  updateScore(parent: any, key: any, data: any): void {
  
    if (key === 'die1'){
      this.die1Score.setText("dieOne: " + data)
    }
    if (key === 'die2'){
      this.die2Score.setText("dieTwo: " + data)
    }
    if (key === 'die1-selected'){
      //console.log("die1 selected: " + data)
    }
    if (key === 'die2-selected'){
        //console.log("die2 selected: " + data)
    }
    if (key === 'currentPlayer'){
      this.displayPlayerName.setText("CurrentPlayer: " + data)
    }
  
  }
     
};
