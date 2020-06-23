
import {Rule} from './rule'
import {UserPlayerFactory} from './userPlayerFactory'
import {PieceFactory} from './pieceFactory'
import {Dice} from './dice'
import {Die} from './die'
import {Room} from "colyseus.js";


export default class CreateAssets {
    rule: Rule
    constructor(rule: Rule){
        this.rule = rule
    }

    createUserPlayers(players: any, room?: Room): void {
        //this.rule.deleteAllPlayers()
        for (let player of players) {
            if (!this.rule.containsPlayerWithSessionId(player.sessionId)) {
                let userPlayerFactory = new UserPlayerFactory(this.rule.scene)
                let ludoPlayer = userPlayerFactory.createPlayer(player.playerName, room, player.playerTurn);
                ludoPlayer.sessionId = player.sessionId
                let pieceFactory = new PieceFactory(this.rule.scene)
                for (let piece of player.pieces) {
                    let ludoPiece = pieceFactory.createPiece(piece, room)
                    ludoPlayer.addPiece(ludoPiece)
                    ludoPlayer.setPieceDraggable()
                }
                this.rule.addPlayer(ludoPlayer)
                console.log("player was added. Player size is: " + this.rule.players.length)
            }else {
                console.log("player was not added. Player size is: " + this.rule.players.length)
            }
        }
    }

    createDice(diceConfig: any, room?: Room): Dice {
        let dice = new Dice(this.rule.scene, room)
        dice.addDice(new Die(this.rule.scene, 820, 360, this.getFrameFromValue(diceConfig[0].dieValue), diceConfig[0].dieId))
        dice.addDice(new Die(this.rule.scene, 920, 360, this.getFrameFromValue(diceConfig[1].dieValue), diceConfig[1].dieId))
        return dice      
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

}