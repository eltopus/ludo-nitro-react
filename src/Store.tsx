import React from 'react'

interface IState {
    playerName: string
    playerMode: string
    gameCode: string
    colors: string[]
}

const initialState: IState =  {
    playerName: '',
    playerMode: '',
    gameCode: '',
    colors: [],
}

interface IAction {
    type: string,
    payload: any
}

export const Store = React.createContext<IState | any>(initialState)

function reducer(state: IState, action: IAction): IState {
    switch(action.type){
        case 'FETCH_DATA':
            return {...state, colors: action.payload}
        case 'UPDATE_PLAYER_NAME':
            return {...state, playerName: action.payload}
        case 'UPDATE_PLAYER_MODE':
            return {...state, playerMode: action.payload}
        case 'UPDATE_GAME_CODE':
            return {...state, gameCode: action.payload}
        case 'UPDATE_COLORS':
        {
            if (state.colors.includes(action.payload)){
                return {...state, colors: state.colors.filter(payload => payload !== action.payload)}
            }else {
                if (state.colors.length < 2){
                    return {...state, colors: state.colors.concat([action.payload])}
                }else {
                    return state
                }
                
            }
        }
        default:
            return state
    }
}

export function StoreProvider(props: any): JSX.Element {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    return <Store.Provider value={{state, dispatch}}>
        {props.children}
    </Store.Provider>
}

