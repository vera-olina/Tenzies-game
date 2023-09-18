import React from 'react'
import Die from './assets/Die'
import Stats from './assets/Stats'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
import './style.css'

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [clickCount, setClickCount] = React.useState(0);
    const [timeCount, setTimeCount] = React.useState({minutes:0, seconds:0})
    const [bestTime, setBestTime] = React.useState(() => {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        return storedUserData || { minutes: Infinity, seconds: Infinity };
    });

    //CountUp Timer
    React.useEffect(() => {
        if(!tenzies){
            const interval = setInterval(() => {
                if (timeCount.seconds < 59) {
                  setTimeCount((prevTime) => ({ ...prevTime, seconds: prevTime.seconds + 1 }));
                } else {
                  setTimeCount((prevTime) => ({
                    minutes: prevTime.minutes + 1,
                    seconds: 0
                  }));
                }
              }, 1000);
              return () => clearInterval(interval);
        } else {
            setTimeCount((prevTime) => ({
                minutes: 0,
                seconds: 0
            }))
        }
        
    },[timeCount])

    React.useEffect(() => {
        const allHeld = dice.every((die) => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every((die) => die.value === firstValue)

        // Calculate total time in seconds for timeCount and bestTime
        const currentTimeInSeconds = timeCount.minutes * 60 + timeCount.seconds;
        const bestTimeInSeconds = bestTime.minutes * 60 + bestTime.seconds;

        //Check if all the dice are held and have the same value
        if (allHeld && allSameValue) {
            setTenzies(true)
            console.log("You won!")

            if (currentTimeInSeconds < bestTimeInSeconds) {
                    setBestTime(timeCount);
                    const userData = { bestTime: timeCount };
                    localStorage.setItem('bestTime', JSON.stringify(userData))
                }
        }
    }, [dice, bestTime, timeCount])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6), 
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies){
            setDice(prevDice => 
                prevDice.map(die => {
                    return die.isHeld ? die : generateNewDie()
                }))
            
            setClickCount(clickCount+1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setClickCount(0)
        }
        
    }

    function holdDice(id) {
        setDice(prevDice => 
            prevDice.map(die => {
                return die.id === id ? {...die, isHeld: !die.isHeld} : die
            }))
    }
        
    const diceElements = dice.map(die => (
        <Die key={die.id} value={die.value} isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

    return (
        <main className="main">
            {tenzies && <Confetti /> }
            <h1 className='title'>Ten<span className='title-span'>zies</span></h1>
            <Stats
                timeCount={timeCount} 
                bestTime = {bestTime}
                tenzies={tenzies}
            />
            <p className='instructions'>Roll until all dice are the same. Click each die to freeze 
                it at its current value between rolls.</p>
            <div className='die-container'>
                <div className='die-cover'></div>
                <div className="die">
                    {diceElements}
                </div>
            </div>    
            
            <button className='main-button' onClick={rollDice}>
                {tenzies?'New Game':'Roll'}
            </button>
            <p >Attemps: {clickCount}</p>
        </main>
    )
}
