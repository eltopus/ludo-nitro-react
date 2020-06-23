
import React from 'react'

//let options: ['Red', 'Blue', 'Yellow', 'Green'];
//let option = "Red" 

interface SelectProps {
  title: string
  options: string[]
  name: string
  value: string
  placeholder: string
  handleChange: any
}

/**
 * This functional component emits an event to the Phaser MainScene
 */
const Select: React.SFC<SelectProps> = ({ title, options, name, value, placeholder, handleChange}) => (
  
  <div className="form-group">
    <label htmlFor={name} className="form-label">{title}</label>
	<select
		id={name}
		name={name}
		value={value}
		onChange={handleChange}
		className="form-control">
		<option value="" disabled>{placeholder}</option>
		{options.map(option => {
			return (
				<option
					key={option}
					value={option}
					label={option}>{option}
				</option>
			);
		})}
	</select>
  </div>
)
export default Select