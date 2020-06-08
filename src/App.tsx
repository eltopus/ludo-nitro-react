import React, { useState } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import logo from './assets/logo.png'
import {GameScene} from './gameScene'

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
      gravity: { y: 400 },
      debug: true
    }
  },
  backgroundColor: "#18216D",
  scene: GameScene
};

const destroy = () => window.location.reload()

export default function App () {
  const [initialize, setInitialize] = useState(false)

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
            <img src={logo} className="App-logo" alt="logo" />
            <div onClick={() => setInitialize(true)} className="flex">
              <a href="#1" className="bttn">Initialize</a>
            </div>
          </>
        )}
      </header>
    </div>
  );
}
