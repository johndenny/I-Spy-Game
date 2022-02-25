import React, { useEffect, useState } from "react";
import './Leaderboard.css'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
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

const Leaderboard = (props) => {
  const { params, highScoreID, leaderboardID } = props;
  const [leaderboard, setLeaderboard] = useState([]);

  const getLeaderboard = async () => {
    console.log(leaderboardID);
    let collectionId = leaderboardID || params.id;
    onSnapshot(collection(getFirestore(), `${collectionId}-leaderboard`), (snapShot) => {
      const leaderboardArray = [];
      snapShot.forEach((doc) => {
        leaderboardArray.push({id: doc.id, ...doc.data()});
      });
      const sortedArray = leaderboardArray.sort((a, b) => {
        return a.totalSeconds - b.totalSeconds;
      });
      const topTen = sortedArray.slice(0, 10);
      console.log(sortedArray, topTen);
      setLeaderboard(topTen);
    });
  };

  useEffect(() => {
    let isMounted = true;
    getLeaderboard().then(
      isMounted === true ? isMounted = false : isMounted = true
    );
  }, []); 

  return (
    <div className="leaderboard-wrapper">
      <ol>
        <li><span>Name</span> <span>Score</span></li>
        {leaderboard.map((element) => 
          <li className={element.id === highScoreID ? 'new-score' : ''} key={element.id} id={element.id}>
            <span>
            {element.name}
            </span>
            <span className="time-score">
              <div className="minute-wrapper">
                {element.scoreMinutes > 0 && element.scoreMinutes}
                {element.scoreMinutes > 0 && <span className="minute">m</span>}                
              </div>
              <div className="second-wrapper">
                {element.scoreSeconds > 0 && element.scoreSeconds}
                {element.scoreSeconds > 0 && <span className="second">s</span>}                
              </div>
            </span> 
          </li>
        )
        }
      </ol>

    </div>
  )
};

export default Leaderboard;