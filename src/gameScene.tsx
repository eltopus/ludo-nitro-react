/*eslint-disable */
import "phaser";
import React from 'react'
import { render } from 'react-dom'
import {PieceFactory} from './pieceFactory'
import {Die} from './die'
import {Dice} from './dice'
import {SideSceneEmitter} from './sideSceneEmmiter'
import {UserPlayerFactory} from './userPlayerFactory'
import {Rule} from './rule'
import {Draggable} from './draggable'
import { ActivePath } from "./activePath";
import {Client} from "colyseus.js";
import {Player} from './player'
//const axios = require('axios').default;
import GameMenu from './containers/GameMenu';
import {Store} from './Store'
import Button from './react/button'


export class GameScene extends Phaser.Scene {
  info: any;
  private currentPlayer: Player = null
  private rule: Rule;
  private paths: ActivePath[] = []
  sendOnce = true
  ludo: any
  die1Score: Phaser.GameObjects.Text
  die2Score: Phaser.GameObjects.Text
  displayPlayerName: Phaser.GameObjects.Text
  emitter: SideSceneEmitter
  host: string
  client: Client
  dice: Dice = null
  playerName: string =  "playerOne"
  pieceIds: string[] = ["red", "blue"]
  uuid: string = "abcd"
  constructor() {
    super({
      key: "GameScene"
    });
    
  }

  init(state?: any): void {
    console.log("state is: ", state)
    this.cameras.main.setViewport(0, 0, 1020, 721);
  }

  preload(): void {


    this.load.image("board", 'http://localhost:2567/board.jpg');
    this.load.image('red1', 'http://localhost:2567/red.png');
    this.load.image('red2', 'http://localhost:2567/red.png');
    this.load.image('red3', 'http://localhost:2567/red.png');
    this.load.image('red4', 'http://localhost:2567/red.png');

    this.load.image('blue1', 'http://localhost:2567/blue.png');
    this.load.image('blue2', 'http://localhost:2567/blue.png');
    this.load.image('blue3', 'http://localhost:2567/blue.png');
    this.load.image('blue4', 'http://localhost:2567/blue.png');

    this.load.image('yellow1', 'http://localhost:2567/yellow.png');
    this.load.image('yellow2', 'http://localhost:2567/yellow.png');
    this.load.image('yellow3', 'http://localhost:2567/yellow.png');
    this.load.image('yellow4', 'http://localhost:2567/yellow.png');

    this.load.image('green1', 'http://localhost:2567/green.png');
    this.load.image('green2', 'http://localhost:2567/green.png');
    this.load.image('green3', 'http://localhost:2567/green.png');
    this.load.image('green4', 'http://localhost:2567/green.png');

    this.load.spritesheet('die1', 'http://localhost:2567/dice.png', { frameWidth: 69, frameHeight: 69, endFrame: 5 })
    this.load.spritesheet('die2', 'http://localhost:2567/dice.png', { frameWidth: 69, frameHeight: 69, endFrame: 5 })
    this.load.image('rollDice', 'http://localhost:2567/rollDice.png')
    this.load.image('play', 'http://localhost:2567/play.png')
    this.load.image('save', 'http://localhost:2567/save.png')
    this.load.image('flick', 'http://localhost:2567/flick.png')
    
  }

  create(): void {
    this.rule = new Rule(this)
    this.host = (window.document.location.host || "localhost").replace(/:.*/, '');
    this.client = new Client('ws://' + this.host + ':2567');

    this.emitter = new SideSceneEmitter(this)
    this.add.image(361, 361, 'board') 
    let play = this.add.sprite(868, 600, 'play')
    play.setInteractive()
    let save = this.add.sprite(800, 500, 'save')
    save.setInteractive()
    let flick = this.add.sprite(800, 100, 'flick')
    flick.setInteractive()

    let graphics = this.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeRoundedRect(723, 1, 300, 721, 32);
    graphics.strokeRoundedRect(723, 300, 300, 120, 32);
    let rollDice = this.add.sprite(950, 500, 'rollDice')
    rollDice.setScale(0.2, 0.2)
    rollDice.setInteractive()
    
    rollDice.on('pointerdown', (pointer: any) => {
      let value1 =  Phaser.Math.Between(1, 6)
      let value2 =  Phaser.Math.Between(1, 6)
      value1 = 6
      value2 = 4
      this.emitter.emmitDiceRoll(value1, value2)
    });

    flick.on('pointerdown', (pointer: any) => {});

    play.on('pointerdown', (pointer: any) => {
      if (this.currentPlayer.hasSelectedPiece()) {
        if (this.paths.length > 0){
          if (this.singleDieIsSelected()){
            //console.log("Single Die selected....")
            let selectedDieId = this.getSelectedSingleDieId()
            let dieValue = this.getSelectedDieValue(selectedDieId)
            this.playDiceValue(dieValue, selectedDieId)

          }else if (this.bothDiceSelected()) {
            //console.log("Both Dice selected....")
            let selectedDieIds = this.getSelectedBothDiceIds()
            let dieValue = this.getSelectedDieValue(selectedDieIds)
            this.playDiceValue(dieValue, selectedDieIds)
          }else {
            console.log("Please select die...")
          }
        }else {
          // no die selection needed
          console.log("Path's lenght is 0")
        }
      }else {
        console.log("Please select piece...")
      } 
    });

    this.client.joinOrCreate("ludo", {playerName: this.playerName, pieceIds: this.pieceIds, uuid: this.uuid})
    .then(room => {
      console.log("joined successfully", room.sessionId);

      room.state.games.onAdd = (game: any, key: any) => {
        //console.log(game, "has been added at", key);
        if (this.dice === null){
          this.dice = new Dice(this)
          this.dice.addDice(new Die(this, 820, 360, this.getFrameFromValue(game.dice[0].dieValue), game.dice[0].dieId))
          this.dice.addDice(new Die(this, 920, 360, this.getFrameFromValue(game.dice[1].dieValue), game.dice[1].dieId))
        }
        
        this.rule.deleteAllPlayers()
        for (let player of game.players){
          let userPlayerFactory = new UserPlayerFactory(this)
          let ludoPlayer = userPlayerFactory.createPlayer(player.playerName);
          let pieceFactory = new PieceFactory(this)
          for (let piece of player.pieces){
            let ludoPiece = pieceFactory.createPiece(piece)
            ludoPlayer.addPiece(ludoPiece)
            ludoPlayer.setPieceDraggable()
            this.rule.addPlayer(ludoPlayer)
          }
        }
       
        // If you want to track changes on a child object inside a map, this is a common pattern:
        game.onChange = function(changes: any) {
            changes.forEach((change: any) => {
                //console.log(change.field);
                //console.log(change.value);
                //console.log(change.previousValue);
            })
        };
    
        // force "onChange" to be called immediatelly
        game.triggerAll();
    };

      room.onStateChange((state: any) => {
        //console.log(state);
        
      });

      room.onMessage("play", (message) => {
        console.log(this.client, "received on", room.name, message);
      });

      room.onLeave((code) => {
        console.log(this.client, "left", room.name);
      });


    }).catch(e => {
      console.error("join error", e);
    });

     this.die1Score = this.add.text(780, 200, "dieOne: 0")
     this.die2Score = this.add.text(880, 200, "dieTwo: 0")

     this.displayPlayerName = this.add.text(750, 150, "CurrentPlayer: " + this.registry.get('currentPlayer'))
     this.registry.events.on('changedata', this.updateScore,  this)
     

    let draggable = new Draggable(24.1, 48.1, this)
    this.input.on('drag', function (pointer: any, gameObject: any, dragX: number, dragY: number) {
      gameObject.x = dragX;
      gameObject.y = dragY;

    });

    this.input.on('dragend', function (pointer: any, gameObject: any) {
      draggable.configureDraggable(gameObject)
    });

    this.events.on('pieceMovementCompleted', this.evaluatePieceMovementCompletion, this);
    this.events.on('dieRolledCompleted', this.evaluateDiceRollCompletion, this);
    this.addOpposingPlayers()

    //this.currentPlayer = this.rule.getNextPlayer()
    //this.registry.set('currentPlayer', this.currentPlayer.playerName)
    //this.currentPlayer.playerRollDice()
    let reactDiv = document.getElementById('react')
    
    const App = () => (
      <div style={{ textAlign: 'center' }}>
        <Button scene={this} />
      </div>
    )
    let react = this.add.dom(0, 0, reactDiv)
    console.log("react: ", reactDiv)
    render(<App />, react.node)
  
  }  
  update(time: number): void {
    // for (let die of this.dice.dice){
    //   if (die.hasValue()){
    //     die.alpha = 1
    //   }else {
    //     die.alpha = 0.5
    //   }
    // }
  }

  playDiceValue(dieValue: number, diceIds: Array<string>): void {
    let piecePath  = this.currentPlayer.selectedPiece.generatePath(dieValue, true)
    if (this.isVadidPath(piecePath)){
      console.log(piecePath.pathToString() + " is valid!")
      diceIds.forEach(id => {
        this.events.emit('resetSingleDie', id)
      });
      let isMoved = this.currentPlayer.moveSelectedPiece(dieValue)
      if (isMoved){

      }
    }else{
      console.log(piecePath.pathToString() + " is NOT valid!")
    }   
  }

  addOpposingPlayers(): void {
    for (let player of this.rule.players){
      this.rule.addOpposingPlayerstoAI(player)
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

  singleDieIsSelected(): boolean {
    return (this.registry.get('die1-selected') && !this.registry.get('die2-selected')) || 
           (!this.registry.get('die1-selected') && this.registry.get('die2-selected'))
  }

  bothDiceSelected(): boolean {
    return (this.registry.get('die1-selected') && this.registry.get('die2-selected'))
  }

  getSelectedSingleDieId(): Array<string> {
    let ids = []
    if (this.registry.get('die1-selected')) {
      ids.push('die1')
    }else {
      ids.push('die2')
    }
    return ids
  }
  getSelectedBothDiceIds(): Array<string> {
    return ["die1", "die2"]
  }

  getSelectedDieValue(dieIds: Array<string>): number {
    let value = 0
    dieIds.forEach((id)=> {
      value += this.registry.get(id)
    })
    return value
  }
  
  printPath(): void {
    if (this.paths !== null){
       this.paths.forEach((path: ActivePath)=> {
        console.log(path.pathToString())
      })
    }
   
  }

  isVadidPath(activePath: ActivePath) {
    for (let path of this.paths){
      if (path.pathToString() === activePath.pathToString()){
        return true
      }
    }
    return false
  }

  evaluatePieceMovementCompletion(pieceId: string, pieceIndex: number): void {
    let opposingPieces = this.rule.getAllPiecesAtIndex(pieceIndex)
    for (let oppossingPiece of opposingPieces){
      this.rule.handlePeckingSituation(pieceId, oppossingPiece)
      break
    }
    // check if player wins
    if (this.currentPlayer.hasNoPiecesLeft()){
      alert(this.currentPlayer.playerName + " wins!!!")
    }
    this.paths = this.rule.evaluatePieceMovementCompletion()
    if (this.paths.length === 0) {
      if (this.rule.rolledDoubleSix){
        console.log("Stay on current player because of prior double six")
        this.rule.rolledDoubleSix = false
        this.currentPlayer.playerRollDice()
      }else {
        this.currentPlayer = this.rule.getNextPlayer()
        this.currentPlayer.playerRollDice()
      }
    }else {
      console.log("Evaluate Game is true after first play. Stay on player: " + this.currentPlayer.playerName)
      this.printPath()
      this.currentPlayer.playerPlayDice(this.paths)
    }
  }

  evaluateDiceRollCompletion(diceRollValue: number): void {
    if (diceRollValue === 12){
      console.log("doublesix roll set: " + diceRollValue)
      this.rule.rolledDoubleSix = true
    }
    this.paths = this.rule.evaluateDiceRollCompletion()
    if (this.paths.length === 0) {
      this.currentPlayer = this.rule.getNextPlayer()
      this.currentPlayer.playerRollDice()
    }else {
      console.log("Evaluate Game is true. Stay on player: " + this.currentPlayer.playerName)
      this.printPath()
      this.currentPlayer.playerPlayDice(this.paths)
    }
  }

  getFrameFromValue(value: number): number {
    switch(value) {
        case 4:
            return 0
        case 5:
            return 1
        case 6:
            return 2
        case 2:
            return 3
        case 3:
            return 4
        default:
            return 5;
    }
}
     
};
