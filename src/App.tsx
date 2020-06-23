import React, { useState } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import {GameScene} from './gameScene'
import GameMenu from './containers/GameMenu';

import './App.css'

const game: Phaser.Types.Core.GameConfig = {
  width: "100%",
  height: "100%",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.AUTO,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1027,
    height: 722,
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#18216D",
  scene: [GameScene]
};

const destroy = () => {
  
  window.location.reload()
} 

export default function App (): JSX.Element {
  const [initialize, setInitialize] = useState(true)


  // React.useEffect(() => {
  //   state.colors.length === 0 && console.log("Color is zero")
  // })

  // const fetchDataAction = async () => {
  //   const URL = 'http://localhost:2567/data'
  //   const data = await fetch(URL)
  //   const dataJSON = await data.json();
  //   return dispatch({
  //     type: 'FETCH_DATA',
  //     payload: dataJSON
  //   })
  // }
 
  return (
  
    <div className="App">
      <header className="App-header">
        { initialize ? (
          <>
            <IonPhaser game={game} initialize={initialize} />
            <div onClick={destroy} className="flex destroyButton">
              <a href="#1" className="bttn">Destroy</a>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-6">
              <h3> Sample Form Container </h3>
              <GameMenu/>
            </div>
            <div onClick={() => {setInitialize(true)}} className="flex" >
              <a href="#1" className="bttn">Initialize</a>
            </div>
          </>
        )}
      </header>
    </div>
  );
}
