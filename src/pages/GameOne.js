import './GameOne.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import DropDownMenu from '../components/DropDownMenu';
import { useParams } from 'react-router-dom';
import GameFooterText from '../components/GameFooterText';
import EndGameModal from '../components/EndGameModal';
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

const GameOne = () => {
  const params = useParams();
  const [finalScore, setFinalScore] = useState({});
  const [imageURL, setImageURL] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [xPercent, setXPercent] = useState(0);
  const [yPercent, setYPercent] = useState(0);
  const [reverseMenu, setReverseMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [objectList, setObjectList] = useState([]);
  const [imageLoadingHidden, setImageLoadingHidden] = useState(false)

  const removeMatch = (id) => {
    const newObjectList = objectList;
    const index = newObjectList.findIndex((element) => element.id === id);
    newObjectList[index].match = true;
    newObjectList[index].xMatch = xPercent;
    newObjectList[index].yMatch = yPercent;
    setObjectList(newObjectList);
  }

  const getImage = () => {
    setImageLoading(true);
    const storage = getStorage();
    getDownloadURL(ref(storage, `gs://i-spy-f2412.appspot.com/${params.id}.jpg`))
      .then((url) => {
        setImageURL(url);
        setImageLoading(false);
      })    
  }

  const hideImageLoader = () => {
    setImageLoadingHidden(true);
  }

  const getObjects = async () => {
    const objects = []
    const docRef = (collection(getFirestore(), params.id));
    const docsSnap = await getDocs(docRef);
    docsSnap.forEach((doc) => {
      objects.push({id: doc.id, text: doc.data().text, match: doc.data().match});
    });
    console.log(objects);
    setObjectList(objects);
  }

  async function checkForMatch(event) {
    const { id } = event.target;
    const docRef = doc(getFirestore(), params.id, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      const {xMax, xMin, yMax, yMin} = docSnap.data();
      if (xPercent > xMin && xPercent < xMax && yPercent > yMin && yPercent < yMax) {
        console.log('MATCH!');
        removeMatch(id);
        document.querySelector('span#' + id).className = 'found';
        checkIfComplete();
      } else {
        setNoMatch(true);
        setTimeout(() => {setNoMatch(false)}, 1000);
      }
    } else {
      console.log('no such document!');
    }
    setShowMenu(false);
  }

  const imageCoordinates = (event) => {
    setShowMenu(true);
    const { offsetHeight, offsetWidth } = event.target;
    const { offsetX, offsetY } = event.nativeEvent;
    console.log(event, offsetX, offsetY);
    console.log((offsetY / offsetHeight) * 100);
    console.log((offsetX / offsetWidth) * 100);
    (offsetY / offsetHeight) > 0.5 
      ? setReverseMenu(true)
      : setReverseMenu(false);
    setXPercent((offsetX / offsetWidth) * 100);
    setYPercent((offsetY / offsetHeight) * 100);
  }

  const checkIfComplete = () => {
    const matches = objectList.findIndex((element) => element.match === false);
    if (matches === -1) {
      endTimer();
    }
  }

  const startTimer = async () => {
    const timerRef = doc(getFirestore(), 'timestamp', 'game-timer');
    await updateDoc(timerRef, {
      start: serverTimestamp()
    });
  }

  const endTimer = async () => {
    const timerRef = doc(getFirestore(), 'timestamp', 'game-timer');
    await updateDoc(timerRef, {
      end: serverTimestamp()
    });
    getFinalScore();
  }

  const getFinalScore = async () => {
    const timerRef = doc(getFirestore(), 'timestamp', 'game-timer')
    const timerSnap = await getDoc(timerRef);
    if (timerSnap.exists) {
      let scoreSeconds = 0;
      let scoreMinutes = 0;
      const seconds = timerSnap.data().end.seconds - timerSnap.data().start.seconds;
      console.log(seconds);
      if (seconds > 60) {
        scoreMinutes = Math.round(seconds/60);
        console.log(Math.floor(seconds/60), (seconds/60));
        scoreSeconds = Math.round(((seconds/60) - Math.floor(seconds/60)) * 60);
      } else {
        scoreSeconds = seconds
      }
      console.log(scoreMinutes + ':' + scoreSeconds);
      setFinalScore({scoreMinutes: scoreMinutes, scoreSeconds: scoreSeconds, totalSeconds: seconds})
      setGameOver(true);
    }
  }

  useEffect(() => {
    getImage();
    getObjects();
    startTimer();
  }, []);

  return (
    <div className="main-wrapper">
      {gameOver &&
        <EndGameModal params={params} finalScore={finalScore} />      
      }
      <div className='main-image-wrapper'>
        <div className='image-wrapper fixed-ratio fixed-ratio-16by9'>
          {!imageLoadingHidden &&
            <div 
              className={imageLoading ? ['loader-wrapper', 'fixed-ratio-content'].join(' ') : ['loader-wrapper', 'fixed-ratio-content', 'fade-out'].join(' ')}
              onAnimationEnd={hideImageLoader}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
              </svg>
            </div>          
          }
          <img className='fixed-ratio-content' src={imageURL} alt="i-spy" onClick={imageCoordinates}/>
          {showMenu &&
            <DropDownMenu objectList={objectList} checkForMatch={checkForMatch} xPercent={xPercent} yPercent={yPercent} reverseMenu={reverseMenu} />              
          }
          {objectList.map((element) => 
            <div 
              key={element.id} 
              style={{top: element.yMatch + '%', left: element.xMatch + '%' }} 
              className={element.match ? ['checkmark'].join(' ') : ['checkmark', 'hidden'].join(' ')} 
              id={element.id}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
              </svg>
            </div>)
          }
          {noMatch &&
            <div className='xMark' style={{top: yPercent + '%', left: xPercent + '%'}} >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
          }
        </div>
        <GameFooterText params={params} />
      </div>
    </div>
  );
}

export default GameOne;
