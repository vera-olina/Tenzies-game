import React from 'react'

export default function Die(props) {
    const style = {
        backgroundColor: props.isHeld? "#F6EB7A":"white"
    }

    return (
        <div className='die-face' style={style} onClick={props.holdDice}>
            {[...Array(props.value)].map((index) => (
                <span key={index} className='die-dot'></span>
            ))}
        </div>
    )
}

