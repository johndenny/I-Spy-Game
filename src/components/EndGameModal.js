import './EndGameModal.css';
import React, { useEffect, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, addDoc } from "firebase/firestore";
import Leaderboard from './Leaderboard';
import { Link } from 'react-router-dom';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLbSSyaW3xYYDMdu1PrsbTxBm58Bu3MKI",
  authDomain: "i-spy-f2412.firebaseapp.com",
  projectId: "i-spy-f2412",
  storageBucket: "i-spy-f2412.appspot.com",
  messagingSenderId: "806404653871",
  appId: "1:806404653871:web:a931db2813eee6349ad7da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const EndGameModal = (props) => {
  const { scoreMinutes, scoreSeconds, totalSeconds } = props.finalScore;
  const { params } = props;
  const [leaderboardName, setLeaderboardName] = useState('');
  const [scoreSubmited, setScoreSubmited] = useState(false);
  const [inputHidden, setInputHidden] = useState(false);
  const [notHighScore, setNotHighScore] = useState(false);
  const [highScoreID, setHighScoreID] = useState('');

  const handleName = (event) => {
    const { value } = event.target;
    setLeaderboardName(value)
  }

  const submitScore = async (event) => {
    event.preventDefault();
    const data = {
      name: leaderboardName, 
      scoreMinutes: scoreMinutes, 
      scoreSeconds: scoreSeconds, 
      totalSeconds: totalSeconds};
    const docRef = await addDoc(collection(getFirestore(), `${params.id}-leaderboard`), data);
    setScoreSubmited(true);
    setHighScoreID(docRef.id);
    setTimeout(() => {
      setHighScoreID('');
    }, 5000);
  }

  const compareLeaderboardScores = async () => {
    const snapShot = await getDocs(collection(getFirestore(), `${params.id}-leaderboard`));
    const leaderboardArray = [];
    snapShot.forEach((doc) => {
      leaderboardArray.push(doc.data().totalSeconds);
    });
    const sortedArray = leaderboardArray.sort((a, b) => {
      return a.totalSeconds - b.totalSeconds;
    });
    const topTen = sortedArray.slice(0, 10);
    const isScoreTopTen = topTen.findIndex((element) => element > totalSeconds);
    if (isScoreTopTen === -1) {
      setInputHidden(true)
      setNotHighScore(true)
    } else {
      setInputHidden(false);
      setNotHighScore(false);
    }
  }

  const hideInput = () => {
    setInputHidden(true);
  }

  useEffect(() => {
    compareLeaderboardScores();
  },[]);

  return (
    <div className="end-game-modal">
      <div className="modal-content">
        <h1>Congratulations!</h1>
        <div className="score-wrapper">
          Your Score is:
          <div className="time-wrapper">
            {scoreMinutes !== 0 &&
              scoreMinutes + ' minutes and ' 
            }
            {scoreSeconds} seconds            
          </div>
        </div>
        <form 
          className={scoreSubmited ? ['leaderboard-form', 'slideOver'].join(' ') : 'leaderboard-form'} 
          onAnimationEnd={hideInput} 
          hidden={inputHidden}
        >
          <h2><span>You got a Highscore!</span> <span>Add a Name to the Leaderboard</span></h2>
          <div className="form-inputs-wrapper">
            <label className='leaderboard-label' htmlFor='leaderboard-name'>
              <span>Name</span>
              <input className="leaderboard-name-input" id="leaderboard-name" autoComplete="off" onChange={handleName}/>          
            </label>
            <button className="submit-button" onClick={submitScore}>
              Submit
            </button>            
          </div>
        </form>
        {notHighScore && 
        <div className='not-highscore'>You did not get a Highscore.</div>        
        }
        <Leaderboard params={params} highScoreID={highScoreID} />
        <div className='return-button-wrapper'>
          <Link to='/' className='return-button'>
            Main Menu
          </Link>
        </div>         
      </div>
    </div>
  )
}

export default EndGameModal;