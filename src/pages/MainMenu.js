import './MainMenu.css';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeaderboardModal from '../components/LeaderboardModal';
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


const MainMenu = () => {
  const [imageURLs, setImageURLs] = useState([]);
  const [leaderboardID, setLeaderboardID] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [imageLoadingHidden, setImageLoadingHidden] = useState(false)
  const [imageLoading, setImageLoading] = useState(false);

  const getImages = () => {
    setImageLoading(true);
    const storage = getStorage();
    const promises = [];    
    const photos = ['i-spy-page-12-13', 'i-spy-page-20-21', 'i-spy-page-30-31', 'i-spy-page-8-9'];
    photos.forEach(element => {
      const promise = getDownloadURL(ref(storage, `gs://i-spy-f2412.appspot.com/${element}.jpg`))
        .then((url) => {
          return url
      }); 
      promises.push(promise);
    });

    Promise.all(promises)
      .then(urls => {
        const urlArray = []
        for (let i = 0; i < urls.length; i++) {
          urlArray.push({url: urls[i], id: photos[i]});
        }
        setImageURLs(urlArray);
        setImageLoading(false);
        console.log(urlArray);
      });      
  };

  const selectLeaderboard = (event) => {
    const { id } = event.target;
    setLeaderboardID(id);
    setShowLeaderboard(true);
  }

  const hideModal = () => {
    setShowLeaderboard(false);
  }

  const hideImageLoader = () => {
    setImageLoadingHidden(true);
  }

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className='main-menu-wrapper'>
      {showLeaderboard && 
        <LeaderboardModal hideModal={hideModal} leaderboardID={leaderboardID} />
      }
      <div className='main-menu-inner-wrapper'>
        <h1>I SPY</h1>
        <div className='game-images-wrapper'>
          {imageURLs.map((element) => 
          <div className='game-selection-image-wrapper fixed-ratio fixed-ratio-16by9' key={element.id} id={element.id}>
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
            <img className='fixed-ratio-content' src={element.url} alt='i-spy' />
            <div className='play-button-wrapper'>
              <Link className='play-button' to={`/game/${element.id}`}>Start Game</Link>
              <button className='leaderboard-button' id={element.id} onClick={selectLeaderboard}>
                  Leaderboard
              </button>                
            </div>
          </div>
          )}            
        </div>
      </div>
    </div>
  );
}

export default MainMenu;