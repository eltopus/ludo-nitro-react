import React from 'react'
import Button from './react/Button';
import CheckBox from './react/CheckBox';  
import Select from './react/Select';  
import Input from './react/Input';  

interface MenuProps {
    scene: Phaser.Scene
}

const LudoMenu: React.SFC<MenuProps> = ({scene}): JSX.Element => {
    let playerOptions = ['2P Player vs Player', '2P Player vs Computer', '4P Player vs Player', '4P Player vs Computer'];
    let colorOptions =  ['red', 'blue', 'yellow', 'green'];
    let gameOptions =  ['Create', 'Join'];
   
    const buttonStyle = {
        margin : '10px 10px 10px 10px'
    }

   


  
    interface IState {
        gameMode: string
        playerName: string
        playerMode: string
        gameCode: string
        colors: string[]
        hide: boolean
    }
    
    const initialState: IState =  {
        gameMode: gameOptions[1],
        playerName: '',
        playerMode: '',
        gameCode: '',
        colors: [],
        hide: false
    }
    const [ludoConfig, setLudoConfig] = React.useState(initialState);

     scene.events.on('SUBMIT_FAILED', (status: boolean) => {
        setLudoConfig({...ludoConfig, hide: status})
    }, scene);
    
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
      //console.log(ludoConfig.colors)
  })

  let handleFormSubmit = (e: any) => {
      e.preventDefault();
      setLudoConfig({...ludoConfig, hide: true})
      //console.log(scene)
      //scene.events.emit("FALL", "2212")
  }   
   
  return (
    <div className={ludoConfig.hide ? 'hidden' : ''} style={{ textAlign: 'center' }}>
        <form className='container-fluid' style={{ position: 'relative', left: 400, bottom: -130, fontSize: 20, backgroundColor: '#006dcc' }} onSubmit={handleFormSubmit}>
                <Select 
                        title={'Game Mode'}
                        name={'gameMode'}
                        options = {gameOptions} 
                        value = {ludoConfig.gameMode}
                        placeholder = {'Select Player Mode'}
                        handleChange = {(e: any) => setLudoConfig({...ludoConfig, gameMode: e.target.value})} /> 
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
                    scene={scene}
                    payload={ludoConfig}
                    style={buttonStyle}
                />

        </form>
   
      </div>
    );
}

export default LudoMenu
    
  