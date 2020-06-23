import {Die} from './die'
import {SideSceneEmitter} from './sideSceneEmmiter'
import {PDie} from './persistence/ludo'
import {Room} from "colyseus.js";
export class Dice {
    dice: Array<Die>
    scene: Phaser.Scene
    diceRolledCount: number
    diceRollValue: number
    emitter: SideSceneEmitter
    room: Room
    dieIds: any = []
    constructor(scene: Phaser.Scene, room?: Room) {
        this.dice = new Array<Die>()
        this.diceRolledCount = 0
        this.diceRollValue = 0
        this.scene = scene
        this.emitter = new SideSceneEmitter(scene)
        this.room = room
        this.scene.events.on('dieRolledCompleted', (dieId: string, dieValue: number) => {
            
            ++this.diceRolledCount
            this.dieIds.push({dieId:dieId, dieValue: dieValue})
            this.diceRollValue += dieValue
            if (this.diceRolledCount > 1) {
                 this.emitter.emmitDiceRollCompleted(this.diceRollValue, this.dieIds)
                 this.diceRolledCount = 0
                 this.diceRollValue = 0
                 this.dieIds = []
            }
           
        })
        this.scene.events.on('resetBothDice', () => {
            //console.log("resetting both dice...")
            for (let die of this.dice){
                die.resetDieFrame()
                die.resetDieFrame()
            }
        });

        this.scene.events.on('resetSingleDie', (dieId: string) => {
            //console.log("resetting single die: " + dieId)
            for (let die of this.dice){
                if (die.dieId === dieId){
                    die.resetDieFrame()
                    break
                }
                
            }
           
        });

        this.scene.events.on('rollDice', (value1: number, value2: number) => {
           this.rollDice(value1, value2)
        })

        if (this.room) {
            this.room.onMessage("roll", (message) => {
                console.log("recieved roll on ", this.room.name, message);
                this.remoteRollDice(message.valueOne, message.valueTwo)
            });
        }
    }

    private remoteRollDice(value1: number, value2: number): void {
        this.dice[0].remoteRoll(value1)
        this.dice[1].remoteRoll(value2)
        
    }

    addDice(die: Die): void {
        if (this.dieDoeNotExist(die)){
            this.dice.push(die)
        }
        
    }

    dieDoeNotExist(die: Die): boolean {
        let exist = this.dice.filter((d) => {
            return (d.dieId === die.dieId)
        })
        return (exist.length === 0)
    }

    rollDice(value1: number, value2: number): void {
        if (this.room){
           this.room.send("roll", {valueOne: value1, valueTwo: value2}) 
        }
        this.dice[0].roll(value1)
        this.dice[1].roll(value2)
    }


    getFrame(index: number): number {
        return this.dice[index].dieFrame
    }

    getFrameValue(index: number): number {
        switch(index) {
            case 0:
                return 4
            case 1:
                return 5
            case 2:
                return 6
            case 3:
                return 2
            case 4:
                return 3
            case 5:
                return 1
            default:
                return 0;
        }
    }

    setDieValue(ddice: Array<PDie>): void {
        for (let ddie of ddice){
            if (ddie.dieId === "die1"){
                //this.scene.registry.set('die1', ddie.dieValue)
                for (let die of this.dice){
                    if (die.dieId === 'die1'){
                        die.updateDie(ddie)
                        break
                    }
                }
            }
            if (ddie.dieId === "die2"){
                //this.scene.registry.set('die2', ddie.dieValue)
                for (let die of this.dice){
                    if (die.dieId === 'die2'){
                        die.updateDie(ddie)
                        break
                    }
                }
            }
        }
    }
    
}