
import {Player} from './player'
import {ActivePath} from "./activePath"

export class UserPlayer extends Player {
   // eslint-disable-next-line
    constructor(playerName: string, scene: Phaser.Scene) {
        super(playerName, scene)
    }

    playerRollDice(): void {}
    playerPlayDice(activePath: Array<ActivePath>): void {}
    addOpposingPlayer(player: Player): void {}


}