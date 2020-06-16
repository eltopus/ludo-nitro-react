import React from 'react';  
import CheckBox from '../components/CheckBox';  
import Input from '../components/Input';  
import Select from '../components/Select';
import Button from '../components/Button'
import {Store} from '../Store'
const GameMenu = () => {
    
    let playerOptions = ['2P Player vs Player', '2P Player vs Computer', '4P Player vs Player', '4P Player vs Computer'];
    let colorOptions =  ['Red', 'Blue', 'Yellow', 'Green'];
   
    const buttonStyle = {
        margin : '10px 10px 10px 10px'
    }
  
    const {state, dispatch} = React.useContext(Store)

    let handleFormSubmit = e => {
        e.preventDefault();
    }   
     
    let handleClearForm = e => {
       e.preventDefault();   
    }

    
    return (
            <form className="container-fluid" onSubmit={handleFormSubmit}>
        
                <Input 
                        inputtype={'text'}
                        title= {'Player Name'} 
                        name= {'playerName'}
                        value={state.playerName} 
                        placeholder = {'Enter player name'}
                        handleChange = {e => {
                            return dispatch({
                                type: 'UPDATE_PLAYER_NAME',
                                payload: e.target.value})}} /> 

                <Select 
                        title={'Player Mode'}
                        name={'playerMode'}
                        options = {playerOptions} 
                        value = {state.playerMode}
                        placeholder = {'Select Player Mode'}
                        handleChange = {e => {
                            return dispatch({
                                type: 'UPDATE_PLAYER_MODE',
                                payload: e.target.value})}} /> 

                <Input 
                        inputtype={'text'}
                        title= {'Game Code'} 
                        name= {'gameCode'}
                        value={state.gameCode} 
                        placeholder = {'Enter Game Code'}
                        handleChange = {e => {
                            return dispatch({
                                type: 'UPDATE_GAME_CODE',
                                payload: e.target.value})}} /> 

                <CheckBox  
                        title={'Choose Colors'}
                        name={'colors'}
                        options={colorOptions}
                        selectedOptions = {state.colors}
                        handleChange = {e => {
                            return dispatch({
                                type: 'UPDATE_COLORS',
                                payload: e.target.value})}} /> 
                
                <Button 
                        action = {handleFormSubmit}
                        type = {'primary'} 
                        title = {'Submit'} 
                        style={buttonStyle}/>
                
                <Button 
                        action = {handleClearForm}
                        type = {'secondary'}
                        title = {'Clear'}
                        style={buttonStyle}/>
            </form>
    );
}

export default GameMenu;