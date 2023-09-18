import React from 'react'
import style from './Stats.style.css'

export default function Stats(props) {
    const [name, setName] = React.useState(
        JSON.parse(localStorage.getItem('name')) || 
        ''
    )

    function handleNameChange(event) {
        const newName = event.target.value;
        setName(newName)
        localStorage.setItem('name', JSON.stringify(newName))
    }

    return (
        <div className='stats'>
            <input type='text' className='stats--player-name' placeholder='Player...'
                name='name'
                onChange={handleNameChange}
                value={name}>
            </input>
            <p className='stats--time'>Time: {props.timeCount.minutes}:{props.timeCount.seconds}</p>
            <p className='stats--best-time'>
                Best time: {props.bestTime.minutes === Infinity ? ' 0:0' : 
                ` ${props.bestTime.minutes}:${props.bestTime.seconds}`}
                {setName && props.tenzies && name && ` ${name}`}
            </p>
        </div> 
    )
}