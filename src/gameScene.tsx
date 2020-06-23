/*eslint-disable */
import "phaser";
import React from 'react'
import { render } from 'react-dom'
import { Dice } from './dice'
import { SideSceneEmitter } from './sideSceneEmmiter'
import { Rule } from './rule'
import { Draggable } from './draggable'
import { ActivePath } from "./activePath";
import { Room, Client } from "colyseus.js";
import { Player } from './player'
import LudoMenu from './ludoMenu'
//import LudoClient from "./ludoClient";
import CreateAssets from './createAssets'



export class GameScene extends Phaser.Scene {
  private currentPlayer: Player = null
  private rule: Rule;
  private paths: ActivePath[] = []
  die1Score: Phaser.GameObjects.Text
  die2Score: Phaser.GameObjects.Text
  displayPlayerName: Phaser.GameObjects.Text
  emitter: SideSceneEmitter
  dice: Dice = null
  //ludoClient: LudoClient
  host: string
  client: Client
  room: Room
  asset: CreateAssets

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {
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
    this.emitter = new SideSceneEmitter(this)
    this.asset = new CreateAssets(this.rule)
    //this.ludoClient = new LudoClient(this, this.rule, this.currentPlayer, this.dice)

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
      //console.log("current player: ", this.currentPlayer, " dice is: ", this.dice, " players: " + this.rule.players.length)
      let value1 = Phaser.Math.Between(1, 6)
      let value2 = Phaser.Math.Between(1, 6)
      value1 = 6
      value2 = 5
      this.emitter.emmitDiceRoll(value1, value2)
    });

    flick.on('pointerdown', (pointer: any) => { });

    play.on('pointerdown', (pointer: any) => {
      if (this.currentPlayer.hasSelectedPiece()) {
        if (this.paths.length > 0) {
          if (this.singleDieIsSelected()) {
            let selectedDieId = this.getSelectedSingleDieId()
            let dieValue = this.getSelectedDieValue(selectedDieId)
            this.playDiceValue(dieValue, selectedDieId)

          } else if (this.bothDiceSelected()) {
            let selectedDieIds = this.getSelectedBothDiceIds()
            let dieValue = this.getSelectedDieValue(selectedDieIds)
            this.playDiceValue(dieValue, selectedDieIds)
          } else {
            console.log("Please select die...")
          }
        } else {
          // no die selection needed
          console.log("Path's lenght is 0")
        }
      } else {
        console.log("Please select piece...")
      }
    });

    let handleSubmitEmmision = async (payload: any) => {
      this.host = (window.document.location.host || "localhost").replace(/:.*/, '');
      this.client = new Client('ws://' + this.host + ':2567');
      if (payload.config.gameMode === "Create") {
        try {
          this.room = await this.client.create("ludo", { playerName: payload.config.playerName, pieceIds: payload.config.colors, uuid: payload.config.gameCode })
          console.log("successfully created game with sessionId ", this.room.sessionId);
        } catch (e) {
          console.error(e.message)
          this.events.emit('SUBMIT_FAILED', false)
        }

      } else {
        try {
          this.room = await this.client.join("ludo", { playerName: payload.config.playerName, pieceIds: payload.config.colors, uuid: payload.config.gameCode })
          console.log("successfully joined existing game with sessionId ", this.room.sessionId);
        } catch (e) {
          console.error(e.message)
          this.events.emit('SUBMIT_FAILED', false)
        }

      }

      if (this.room) {
        this.room.state.games.onAdd = (game: any, key: any) => {
          console.log(game, "has been added at", key);
          //this.asset.createUserPlayers(game.players)
          if (this.dice === null) {
            this.dice = this.asset.createDice(game.dice, this.room)
          }

          //If you want to track changes on a child object inside a map, this is a common pattern:
          game.onChange = (changes: any) => {
            changes.forEach((change: any) => {

              if (change.field === 'players') {
                //console.log("change field: ", change.value.toJSON())
                this.asset.createUserPlayers(change.value.toJSON(), this.room)
              } else if (change.field === 'dice') {
                if (this.dice === null) {
                  //this.dice = asset.createDice(change.value.toJSON())
                }
              } else {
                console.log("other fields change: " + change.field)
              }
            })

            // force "onChange" to be called immediatelly
            //game.triggerAll();

            this.currentPlayer = this.rule.getNextPlayer()
           
              this.registry.set('currentPlayer', this.currentPlayer.playerName)
              this.currentPlayer.playerRollDice()
              // this.currentPlayer.pieces.forEach((piece) => {
              //   console.log(piece.pieceId, " ", piece.showPieceState(), " ", piece.showPieceType())
              // })
          }

          this.room.onStateChange((state: any) => {
            //console.log("on state change: ", state.games.toJSON());
          });

          this.room.onStateChange.once((state: any) => {
            //console.log("state change once: ", state.games.toJSON());
          });

          this.room.onLeave((code: any) => {
            console.log(this.client, "left", this.room.name);
          });

          this.room.onError((code, message) => {
            console.log(code, message)
          })
        }
      }
    }

    this.events.on('SUBMIT_FORM', handleSubmitEmmision, this);
    this.die1Score = this.add.text(780, 200, "dieOne: 0")
    this.die2Score = this.add.text(880, 200, "dieTwo: 0")
    this.displayPlayerName = this.add.text(750, 150, "CurrentPlayer: " + this.registry.get('currentPlayer'))
    this.registry.events.on('changedata', this.updateScore, this)

    let draggable = new Draggable(24.1, 48.1, this)
    this.input.on('drag', function (pointer: any, gameObject: any, dragX: number, dragY: number) {
      gameObject.x = dragX;
      gameObject.y = dragY;

    });

    this.input.on('dragend', function (pointer: any, gameObject: any) {
      draggable.configureDraggable(gameObject)
    });

    this.events.on('pieceMovementCompleted', this.evaluatePieceMovementCompletion, this);
    this.events.on('diceRolledCompleted', this.evaluateDiceRollCompletion, this);
    this.addOpposingPlayers()

    let reactDiv = document.getElementById('react')
    let react = this.add.dom(0, 0, reactDiv)
    render(<LudoMenu scene={this} />, react.node)

  }

  update(time: number): void {
    if (this.dice !== null) {
      for (let die of this.dice.dice) {
        if (die.hasValue()) {
          die.alpha = 1
        } else {
          die.alpha = 0.5
        }
      }
    }
  }

  playDiceValue(dieValue: number, diceIds: Array<string>): void {
    //console.log("Number of players: " + this.rule.players.length)
    let piecePath = this.currentPlayer.selectedPiece.generatePath(dieValue, true)
    if (this.isVadidPath(piecePath)) {
      console.log(piecePath.pathToString() + " is valid!")
      diceIds.forEach(id => {
        this.events.emit('resetSingleDie', id)
      });
      let isMoved = this.currentPlayer.moveSelectedPiece(dieValue)
      if (isMoved) {

      }
    } else {
      console.log(piecePath.pathToString() + " is NOT valid!")
    }
  }

  addOpposingPlayers(): void {
    for (let player of this.rule.players) {
      this.rule.addOpposingPlayerstoAI(player)
    }
  }

  updateScore(parent: any, key: any, data: any): void {

    if (key === 'die1') {
      this.die1Score.setText("dieOne: " + data)
    }
    if (key === 'die2') {
      this.die2Score.setText("dieTwo: " + data)
    }
    if (key === 'die1-selected') {
      //console.log("die1 selected: " + data)
    }
    if (key === 'die2-selected') {
      //console.log("die2 selected: " + data)
    }
    if (key === 'currentPlayer') {
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
    } else {
      ids.push('die2')
    }
    return ids
  }
  getSelectedBothDiceIds(): Array<string> {
    return ["die1", "die2"]
  }

  getSelectedDieValue(dieIds: Array<string>): number {
    let value = 0
    dieIds.forEach((id) => {
      value += this.registry.get(id)
    })
    return value
  }

  printPath(): void {
    if (this.paths !== null) {
      this.paths.forEach((path: ActivePath) => {
        console.log(path.pathToString())
      })
    }

  }

  isVadidPath(activePath: ActivePath) {
    for (let path of this.paths) {
      if (path.pathToString() === activePath.pathToString()) {
        return true
      }
    }
    return false
  }

  evaluatePieceMovementCompletion(pieceId: string, pieceIndex: number): void {
    let opposingPieces = this.rule.getAllPiecesAtIndex(pieceIndex)
    for (let oppossingPiece of opposingPieces) {
      this.rule.handlePeckingSituation(pieceId, oppossingPiece)
      break
    }
    // check if player wins
    if (this.currentPlayer.hasNoPiecesLeft()) {
      alert(this.currentPlayer.playerName + " wins!!!")
    }
    this.paths = this.rule.evaluatePieceMovementCompletion()
    if (this.paths.length === 0) {
      if (this.rule.rolledDoubleSix) {
        console.log("Stay on current player because of prior double six")
        this.rule.rolledDoubleSix = false
        this.currentPlayer.playerRollDice()
      } else {
        this.currentPlayer = this.rule.getNextPlayer()
        this.currentPlayer.playerRollDice()
      }
    } else {
      console.log("Evaluate Game is true after first play. Stay on player: " + this.currentPlayer.playerName)
      //this.printPath()
      this.currentPlayer.playerPlayDice(this.paths)
    }
  }

  evaluateDiceRollCompletion(diceRollValue: number, dieIds: any): void {
    if (diceRollValue === 12) {
      console.log("doublesix roll set: " + diceRollValue)
      this.rule.rolledDoubleSix = true
    }
    this.paths = this.rule.evaluateDiceRollCompletion()
    if (this.paths.length === 0) {
      this.currentPlayer = this.rule.getNextPlayer()
      this.currentPlayer.playerRollDice()
    } else {
      console.log("Evaluate Game is true. Stay on player: " + this.currentPlayer.playerName)
      //this.printPath()
      this.currentPlayer.playerPlayDice(this.paths)
    }
  }
};