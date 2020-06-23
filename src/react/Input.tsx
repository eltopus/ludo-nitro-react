import React from 'react'
interface InputProps {
  title: string
  name: string
  type: string
  value: string
  placeholder: string
  handleChange: any
}

/**
 * This functional component emits an event to the Phaser MainScene
 */
const Input: React.SFC<InputProps> = ({ title, name, type, value, placeholder, handleChange}) => (
  <div className="form-group was-validated">
    <label htmlFor={name} className="form-label">{title}</label>
    <input className="form-control"
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder} required/>
  <div className="valid-feedback">Valid.</div>
  <div className="invalid-feedback">{name} is rquired.</div>
    
  </div>
)
export default Input;