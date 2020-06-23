import React from 'react';  
import CheckBox from './CheckBox';  
import Select from './Select';  
import Input from './Input';  
import Button from './Button';  


interface SceneProps {
    scene: Phaser.Scene
}

const GameMenu = (scene: Phaser.Scene) => {
    
    let playerOptions = ['2P Player vs Player', '2P Player vs Computer', '4P Player vs Player', '4P Player vs Computer'];
    let colorOptions =  ['Red', 'Blue', 'Yellow', 'Green'];
   
    const buttonStyle = {
        margin : '10px 10px 10px 10px'
    }
  
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

    const [ludoConfig, setLudoConfig] = React.useState(initialState);

    let handleColorSelection = (e: any) => {
        let selectedColor = e.target.value
        if (ludoConfig.colors.includes(selectedColor)){
            setLudoConfig({...ludoConfig, colors: ludoConfig.colors.filter(payload => payload !== selectedColor)})
        }else {
            if (ludoConfig.colors.length < 2){
                setLudoConfig({...ludoConfig, colors: ludoConfig.colors.concat([selectedColor])})
                
            }else {
                setLudoConfig(ludoConfig)
            }
        }
        
    }

    

    React.useEffect(() => {
        console.log(ludoConfig.colors)
    })


    let handleFormSubmit = (e: any) => {
        e.preventDefault();
        console.log(scene)
        scene.events.emit("FALL", "2212")
    }   
     
    let handleClearForm = (e: any) => {
       e.preventDefault();   
    }

    
    return (
            <form className="container-fluid" style={{ position: 'relative', left: 400, bottom: -150, fontSize: 26, backgroundColor: '#006dcc' }} onSubmit={handleFormSubmit}>

                <Input 
                        type={'text'}
                        title= {'Player Name'} 
                        name= {'playerName'}
                        value={ludoConfig.playerName} 
                        placeholder = {'Enter Player Name'}
                        handleChange = {(e: any) => setLudoConfig({...ludoConfig, playerName: e.target.value})}/> 

                <Select 
                        title={'Player Mode'}
                        name={'playerMode'}
                        options = {playerOptions} 
                        value = {ludoConfig.playerMode}
                        placeholder = {'Select Player Mode'}
                        handleChange = {(e: any) => setLudoConfig({...ludoConfig, playerMode: e.target.value})} /> 

                <CheckBox  
                        title={'Choose Colors'}
                        name={'colors'}
                        options={colorOptions}
                        selectedOptions = {ludoConfig.colors}
                        handleChange = {handleColorSelection} /> 

                <Input 
                        type={'text'}
                        title= {'Game Code'} 
                        name= {'gameCode'}
                        value={ludoConfig.gameCode} 
                        placeholder = {'Enter Game Code'}
                        handleChange = {(e: any) => setLudoConfig({...ludoConfig, gameCode: e.target.value})}/> 

                <Button 
                    handleChange={handleFormSubmit}
                />

            </form>
    );
}

export default GameMenu;