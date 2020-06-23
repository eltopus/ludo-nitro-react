import React from 'react'
//let options: ['Red', 'Blue', 'Yellow', 'Green'];
//let option = "Red" 

interface CheckBoxProps {
  title: string
  options: string[]
  name: string
  selectedOptions: any
  handleChange: any
}

/**
 * This functional component emits an event to the Phaser MainScene
 */
const CheckBox: React.SFC<CheckBoxProps> = ({ title, options, name, selectedOptions, handleChange}) => (
  
  <div className="form-group">
    <label htmlFor={name} className="form-label">{title}</label>
      <div className="checkbox">
          {options.map(option => {
             return (
            <label key={option} className="checkbox-inline">
              <input
                id = {name}
                name={name}
                onChange={handleChange}
                value={option}
                checked={selectedOptions.indexOf(option) > -1}
                type="checkbox" /> {option}
            </label>
             )
          })}
    </div>
  </div>
)
export default CheckBox