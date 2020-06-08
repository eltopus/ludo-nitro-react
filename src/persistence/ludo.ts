
export class Ludo {
    players: Array<PPlayer>
    dice: Array<PDie>
    selectedPieceId: string
    constructor(){
        this.players = new Array<PPlayer>()
        this.dice = new Array<PDie>()
        this.selectedPieceId = ""
    }
}

export class PPlayer {
    playerName: string
    selectedPieceId: string
    pieces: Array<PPiece>
    constructor(){
        this.pieces = new Array<PPiece>()
        this.playerName = ""
        this.selectedPieceId = ""
    }

}

export class PPiece {
    pieceId: string;
    index: number;
    homeIndex: number;
    pieceState: string;
    pieceType: string;
    x: number;
    y: number;
    hx: number;
    hy: number;
    constructor(){
        this.pieceId = "";
        this.index = -1;
        this.homeIndex = -1;
        this.pieceState = "";
        this.pieceType = "";
        this.x = 0;
        this.y = 0;
        this.hx = 0;
        this.hy = 0;
    }
}

export class PDie {
    dieId: string;
    dieValue: number;
    selected: boolean;
    constructor(){
        this.dieId = "";
        this.dieValue = 0;
        this.selected = false;
    }

}
