export class SideSceneEmitter {
    scene: Phaser.Scene
    constructor(scene: Phaser.Scene){
        this.scene = scene
    }

    emmitDiceRollCompleted(diceRollValue: number, dieIds: any): void {
        this.scene.events.emit('diceRolledCompleted', diceRollValue, dieIds)
    }

    emmitDieRollCompleted(dieId: string, dieValue: number): void {
        this.scene.events.emit('dieRolledCompleted', dieId, dieValue)
    }

    emmitDieSelection(dieId: string): void {
        this.scene.events.emit('dieSelection', dieId)
    }

    emmitDiceRoll(value1: number, value2: number): void {
        this.scene.events.emit('rollDice', value1, value2)
    }

}

