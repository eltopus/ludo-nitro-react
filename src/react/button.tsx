import React from 'react'
import { Scene } from 'phaser'

interface ButtonProps {
  scene: Scene
  payload: any
  style: any
}
/**
 * This functional component emits an event to the Phaser MainScene
 */
const Button: React.SFC<ButtonProps> = ({ scene, payload, style}) => (
  <button className='btn btn-success'
  style= {style} 
  onClick={() => {
    if (payload.playerName.length > 0 && payload.gameCode.length > 0){
      scene.events.emit('SUBMIT_FORM', { action: 'SUBMIT_FORM', config: payload })
    }
  }}
  >
    Submit
  </button>
)

export default Button