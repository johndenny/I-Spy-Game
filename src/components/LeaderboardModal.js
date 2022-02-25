import React, { useEffect, useState } from "react";
import Leaderboard from "./Leaderboard";
import './LeaderboardModal.css';

const LeaderboardModal = (props) => {
  const { leaderboardID, hideModal } = props;
  const [leaderboardTitle, setLeaderboardTitle] = useState('');
  const [fadeModal, setFadeModal] = useState(false);
  
  const findTitle = () => {
    if (leaderboardID === 'i-spy-page-12-13') {
      setLeaderboardTitle('Page One');
    };
    if (leaderboardID === 'i-spy-page-20-21') {
      setLeaderboardTitle('Page Two');
    }; 
    if (leaderboardID === 'i-spy-page-30-31') {
      setLeaderboardTitle('Page Three');      
    };
    if (leaderboardID === 'i-spy-page-8-9') {
      setLeaderboardTitle('Page Four');
    };
  };

  const animateModal = () => {
    setFadeModal(true);
  }

  const stopBubbling = (event) => {
    event.stopPropagation();
  }

  const modalStyle = 
    fadeModal 
      ? {
        className: ['leaderboard-modal', 'fade-out'].join(' '),
        onAnimationEnd: hideModal,
      }
      : {
        className: 'leaderboard-modal',
      } 

  useEffect(() => {
    findTitle()
  }, []);

  return (
    <div {...modalStyle} onClick={animateModal}>
      <div className={fadeModal ? ["leaderboard-modal-content", 'fade-move-up'].join(' ') : 'leaderboard-modal-content'} onClick={stopBubbling}>
        <h1>{leaderboardTitle} Leaderboard</h1>
        <Leaderboard leaderboardID={leaderboardID}/>
        <button className='close-leaderboard-button' onClick={animateModal}>Close</button>
      </div>
    </div>
  )
};

export default LeaderboardModal;