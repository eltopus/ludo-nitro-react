
import {Player} from './player'
import {ActivePath} from "./activePath"
import { Room} from "colyseus.js";

export class UserPlayer extends Player {
   // eslint-disable-next-line
    constructor(playerName: string, scene: Phaser.Scene, room?: Room, playerTurn?: boolean) {
        super(playerName, scene, room, playerTurn)
    }

    playerRollDice(): void {}
    playerPlayDice(activePath: Array<ActivePath>): void {}
    addOpposingPlayer(player: Player): void {}


}