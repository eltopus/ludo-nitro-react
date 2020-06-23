import React, { useState } from 'react'
import Phaser from 'phaser'
import {Store} from './Store'
import Button from './react/Button';
import CheckBox from './react/CheckBox';  
import Select from './react/Select';  
import Input from './react/Input';  

interface ButtonProps {
    scene: Phaser.Scene
    payload: any
  }
    
export default function Menu (scene: Phaser.Scene): JSX.Element {
    let playerOptions = ['2P Player vs Player', '2P Player vs Computer', '4P Player vs Player', '4P Player vs Computer'];
    let colorOptions =  ['red', 'blue', 'yellow', 'green'];

    console.log(scene)

    const buttonStyle = {
        margin : '10px 10px 10px 10px'
    }

    
    const {state, dispatch} = React.useContext(Store)

    let handleFormSubmit = (e: any) => {
        e.preventDefault();
        //console.log(scene)
        //scene.events.emit("FALL", "2212")
    }   

    return (
    <div style={{ textAlign: 'center' }}>
        <form className="container-fluid" style={{ fontSize: 26, backgroundColor: '#006dcc' }} onSubmit={handleFormSubmit}>

                <Input 
                        type={'text'}
                        title= {'Player Name'} 
                        name= {'playerName'}
                        value={state.playerName} 
                        placeholder = {'Enter Player Name'}
                        handleChange = {(e: any) => {
                            return dispatch({
                                type: 'UPDATE_PLAYER_NAME',
                                payload: e.target.value})}} /> 

                <Select 
                        title={'Player Mode'}
                        name={'playerMode'}
                        options = {playerOptions} 
                        value = {state.playerMode}
                        placeholder = {'Select Player Mode'}
                        handleChange = {(e: any) => {
                            return dispatch({
                                type: 'UPDATE_PLAYER_MODE',
                                payload: e.target.value})}} /> 

                <CheckBox  
                        title={'Choose Colors'}
                        name={'colors'}
                        options={colorOptions}
                        selectedOptions = {state.colors}
                        handleChange = {(e: any) => {
                            return dispatch({
                                type: 'UPDATE_COLORS',
                                payload: e.target.value})}} /> 

                <Input 
                        type={'text'}
                        title= {'Game Code'} 
                        name= {'gameCode'}
                        value={state.gameCode} 
                        placeholder = {'Enter Game Code'}
                        handleChange = {(e: any) => {
                            return dispatch({
                                type: 'UPDATE_GAME_CODE',
                                payload: e.target.value})}} />  

                <Button 
                    scene={scene}
                    payload={{}}
                />

            </form>

    </div>
    );
}