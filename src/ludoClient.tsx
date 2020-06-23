import {Rule} from './rule'
import { Room, Client } from "colyseus.js";
import { Player } from './player'
import { Dice } from './dice'
import CreateAssets from './createAssets'
export default class LudoClient {
    scene: Phaser.Scene
    rule: Rule
    host: string
    client: Client
    room: Room
    asset: CreateAssets
    currentPlayer: Player
    dice: Dice

    constructor(scene: Phaser.Scene, rule: Rule, currentPlayer: Player, dice: Dice){
        this.scene = scene
        this.rule = rule
        this.asset = new CreateAssets(this.rule)
        this.currentPlayer = currentPlayer
        this.dice = dice
    }

    handleSubmitEmmision = async (payload: any) => {
        this.host = (window.document.location.host || "localhost").replace(/:.*/, '');
        this.client = new Client('ws://' + this.host + ':2567');
        if (payload.config.gameMode === "Create") {
          try {
            this.room = await this.client.create("ludo", { playerName: payload.config.playerName, pieceIds: payload.config.colors, uuid: payload.config.gameCode })
            console.log("successfully created game with sessionId ", this.room.sessionId);
          } catch (e) {
            console.error(e.message)
            this.scene.events.emit('SUBMIT_FAILED', false)
          }
  
        } else {
          try {
            this.room = await this.client.join("ludo", { playerName: payload.config.playerName, pieceIds: payload.config.colors, uuid: payload.config.gameCode })
            console.log("successfully joined existing game with sessionId ", this.room.sessionId);
          } catch (e) {
            console.error(e.message)
            this.scene.events.emit('SUBMIT_FAILED', false)
          }
  
        }
  
        if (this.room) {
          this.room.state.games.onAdd = (game: any, key: any) => {
            console.log(game, "has been added at", key);
            //this.asset.createUserPlayers(game.players)
            if (this.dice === null) {
              this.dice = this.asset.createDice(game.dice)
            }
  
            //If you want to track changes on a child object inside a map, this is a common pattern:
            game.onChange = (changes: any) => {
              changes.forEach((change: any) => {
  
                if (change.field === 'players') {
                  console.log("change field: ", change.value.toJSON())
                  this.asset.createUserPlayers(change.value.toJSON())
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
                this.scene.registry.set('currentPlayer', this.currentPlayer.playerName)
                this.currentPlayer.playerRollDice()
            }
  
            this.room.onStateChange((state: any) => {
              //console.log("on state change: ", state.games.toJSON());
            });
  
            this.room.onStateChange.once((state: any) => {
              //console.log("state change once: ", state.games.toJSON());
            });
  
            this.room.onMessage("play", (message) => {
              console.log(this.client, "received on", this.room.name, message);
            });
  
            this.room.onLeave((code) => {
              console.log(this.client, "left", this.room.name);
            });
  
            this.room.onError((code, message) => {
              console.log(code, message)
            })
          }
        }
      }
}