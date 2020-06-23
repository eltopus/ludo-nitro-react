import {Piece} from './piece'
import {ActivePath} from "./activePath"
import { Room} from "colyseus.js";
export abstract class  Player {
    playerName: string
    playerTurn: boolean
    pieces: Array<Piece>
    exitedPieces: Array<Piece>
    scene: Phaser.Scene
    group: Phaser.Physics.Arcade.Group
    selectedPiece: Piece
    sessionId: string
    room: Room

    constructor(playerName: string, scene: Phaser.Scene, room?: Room, playerTurn?: boolean) {
        this.playerName = playerName
        this.scene = scene
        this.group =this.scene.physics.add.group({})
        this.scene.events.on('pieceSelected', this.pieceSelected, this);
        this.scene.events.on('pieceExited', this.destroyPiece, this);
        this.pieces = new Array<Piece>()
        this.exitedPieces = new Array<Piece>()
        this.room = room
        this.selectedPiece = null
        this.playerTurn = playerTurn

        console.log("PlayerTurn: " + playerTurn)

        if (this.room){

            this.room.onMessage("select", (message) => {
                console.log("recieved select on ", this.room.name, message);
                this.remotePieceSelected(message.pieceId)
            });

            this.room.onMessage("move", (message) => {
                console.log("recieved move on ", this.room.name, message);
                this.remoteMoveSelectedPiece(message.pieceId, message.moveBy)
            });
        }
    }

    private remotePieceSelected(pieceId: string): void {
        for (let piece of this.pieces) {
            if (piece.pieceId === pieceId && this.group.contains(piece)){
                piece.tint = 0x808080;
                if (this.selectedPiece !== null && (typeof this.selectedPiece !== 'undefined') && this.selectedPiece !== piece) {
                    this.selectedPiece.clearTint()
                }
                this.selectedPiece = piece
                return
            }
        }
    }

    private remoteMoveSelectedPiece(pieceId: string, moveBy: number): boolean {
        for (let piece of this.pieces) {
            if (piece.pieceId === pieceId && this.group.contains(piece)){
                piece.move(moveBy)
                return true
            }
        }
        return false
    }

    hasSelectedPiece = () => this.selectedPiece !== null && (typeof this.selectedPiece !== 'undefined')
    selectedPieceIsActive = () => this.selectedPiece.isActive()
    selectedPieceIsNotActive = () => this.selectedPiece.isNotActive()
    doesNotBelong = (piece: Piece) => this.group.contains(piece) === false
    

    addPieces(pieces: Array<Piece>): void {
        for (let piece of pieces){
            this.pieces.push(piece)
        }
        this.group.addMultiple(pieces)
    }

    addPiece(piece: Piece): void {
        this.pieces.push(piece)
        this.group.add(piece)
    }

    pieceSelected(pieceId: string): void {
        
        for (let piece of this.pieces) {
            if (piece.pieceId === pieceId && this.group.contains(piece)){
                piece.tint = 0x808080;
                if (this.room){
                    this.room.send("select", { sessionId: "select", pieceId: piece.pieceId})
                }
                if (this.selectedPiece !== null && (typeof this.selectedPiece !== 'undefined') && this.selectedPiece !== piece) {
                    this.selectedPiece.clearTint()
                }
                this.selectedPiece = piece
                return
            }
        }
    }


    moveSelectedPiece(moveBy: number): boolean {
        if (this.selectedPiece != null && !this.selectedPiece.isMoving()) {
            if (this.room){
                this.room.send("move", {pieceId: this.selectedPiece.pieceId, moveBy: moveBy})
            }
            this.selectedPiece.move(moveBy)
            return true;
        }else {
            return false
        }
    }

    destroyPiece(pieceId: string): void {
        let indexOf = -1
        for (let piece of this.pieces) {
            if (piece.pieceId === pieceId) {
                indexOf = this.pieces.indexOf(piece)
                piece.setVisible(false)
                piece.text.setVisible(false)
                this.exitedPieces.push(piece)
                if (indexOf >= 0) {
                    console.log("Removing piece: " + pieceId)
                    this.pieces.splice(indexOf, 1);
                    break
                }
            }
        }
    }

    setPieceDraggable(): void {
        for (let piece of this.pieces) {
            piece.setDraggable()
        }
    }

    hasActivePieces(): boolean {
        for (let piece of this.pieces) {
            if (piece.isActive()){
                return true
            }
        }
        return false;
    }

    hasJustActivePieces(): boolean {
        for (let piece of this.pieces) {
            if (piece.isNotActive() || piece.isOnHomePath()){
                return false
            }
        }
        return true;
    }

    hasInActivePieces(): boolean {
        for (let piece of this.pieces) {
            if (piece.isInActive()){
                return true
            }
        }
        return false;
    }

    hasNoActivePieces(): boolean {
        for (let piece of this.pieces) {
            if (piece.isActive()){
                return false
            }
        }
        return true;
    }

    hasExactlyOneActiveAndAtLeastOneHomePiece(): boolean {
        let activePieceCount = 0;
        for (let piece of this.pieces) {
            if (piece.isActive() || piece.isOnHomePath()){
                ++activePieceCount
                if (activePieceCount > 1){
                    break
                }
            }
        }
        return (activePieceCount > 1);
    }

    allPiecesAreInactive(): boolean {
        for (let piece of this.pieces) {
            if (piece.isNotActive()){
                return false
            }
        }
        return true;
    }

    hasExactlyOneActivePiece(): boolean {
        let activePieceCount = 0;
        for (let piece of this.pieces) {
            if (piece.isActive()){
                ++activePieceCount
                if (activePieceCount > 1){
                    break
                }
            }
        }
        return (activePieceCount === 1);
    }

    hasExactlyOneInactivePiece(): boolean {
        let inactivePieceCount = 0;
        for (let piece of this.pieces) {
            if (piece.isInActive()){
                ++inactivePieceCount
                if (inactivePieceCount > 1){
                    break
                }
            }
        }
        return (inactivePieceCount === 1);
    }

    
    hasHomePieces(): boolean {
        for (let piece of this.pieces) {
            if (piece.isOnHomePath()){
                return true;
            }
        }
        return false
    }

    getFirstActivePiece(): any {
        for (let piece of this.pieces) {
            if (piece.isActive()){
                return piece
            }
        }
        // eslint-disable-next-line
        return null
    }

    getAllActivePiece(): Array<Piece> {
        let activePieces = []
        for (let piece of this.pieces) {
            if (piece.isActive()){
                activePieces.push(piece)
            }
        }
        return activePieces
    }

    getAllInActivePiece(): Array<Piece> {
        let inActivePieces = []
        for (let piece of this.pieces) {
            if (piece.isInActive()){
                inActivePieces.push(piece)
            }
        }
        return inActivePieces
    }

    bringPiecesToTop(): void {
        this.group.getChildren().forEach((child) => {
            this.scene.children.bringToTop(child)
        })
    }

    hasNoPiecesLeft(): boolean {
        let count = 0
        for (let piece of this.pieces) {
            if (piece.isActive() || piece.isInActive() || piece.isOnHomePath()){
                ++ count
                if (count > 0){
                    break
                }
            }
        }
        return count === 0
    }

    getPiecesBetweenIndex(ppieces : Array < Piece >) : any {
        let data = []
        if (ppieces.length > 0){
                do {
                let playerPiece: any = ppieces.pop()
                for (let opposingPiece of this.pieces) {
                    if (opposingPiece.isActive()) {
                        let stopIndex = (playerPiece.index + 12)
                        let remainder = 0
                        //console.log(opposingPiece.index + " >= " + playerPiece.index + " " + opposingPiece.index + " <= " + stopIndex + " " + opposingPiece.pieceId)
                        if (opposingPiece.index >= playerPiece.index && opposingPiece.index<= stopIndex){
                            data.push({"playerPieceId": playerPiece.pieceId, 
                                        "opposingPieceId": opposingPiece.pieceId, 
                                        "opposingPieceIndex": opposingPiece.index
                            })
                        }
                        if (stopIndex> 51) {
                            remainder = (stopIndex % 51) - 1
                        }
                        if (remainder > 0) {
                            if (opposingPiece.index >= 0 && opposingPiece.index<= remainder){
                            //console.log(pieceIndex + "> = " + 0 + " " + pieceIndex + " <= " + remainder + " " + piece.pieceId)
                            data.push({"playerPieceId": playerPiece.pieceId, 
                                        "opposingPieceId": opposingPiece.pieceId, 
                                        "opposingPieceIndex": opposingPiece.index})
                            }
                        }
                    }
                }
            }
            while (ppieces.length > 0)
        }
        return data
    }

    getPiecesAlongHomeIndex(pieces : Piece []) : any {
        let data = []
        if (pieces.length > 0){
            let opposingPieces = this.getAllActivePiece()
            if (opposingPieces.length < 1){
                return []
            }
            do 
            {
                let playerPiece: any = pieces.pop()
                for (let opposingPiece of opposingPieces){
                    let startIndex: number = playerPiece.startIndex
                    let stopIndex = playerPiece.startIndex + 6
                    if (opposingPiece.indexIsBetween(startIndex, stopIndex)){

                        data.push({"playerPieceId": playerPiece.pieceId, 
                                    "opposingPieceId": opposingPiece.pieceId, 
                                    "opposingPieceIndex": opposingPiece.index
                        })
                        
                    }
                }
            }while(pieces.length > 0)
        }
        //console.log(data)
        return data
    }


    

    abstract addOpposingPlayer(player: Player): void
    abstract playerRollDice(): void 
    abstract playerPlayDice(activePaths: Array<ActivePath>): void 
}