import React from "react";

const GameFooterText = (props) => {
  const { id } = props.params;

  return (
    <div className='footer-text-wrapper'>
      { id === 'i-spy-page-12-13' &&
      <React.Fragment>
        <div className='left-text'>
          <span>
            I spy a <span id='shinyBell'>shiny bell</span>, a <span id='clockFace'>face of a clock</span>,
          </span>
          <span>
            A <span id='toyHorse'>little toy horse</span>, a <span id='littleRock'>round little rock</span>;
          </span>
        </div>
        <div className='right-text'>
          <span>
            A <span id='birthdayCandle'>birthday candle</span>, a <span id='goldRing'>pretty gold ring</span>,
          </span>
          <span>
            A <span id='puzzlePiece'>small puzzle peice</span>, and a <span id='crown'>crown for a king</span>.
          </span>
        </div>             
      </React.Fragment>   
      }

      {id === 'i-spy-page-20-21' &&
      <React.Fragment>
        <div className='left-text'>
          <span>
            I spy a <span id='turtle'>turtle</span>, and <span id='balletSlippers'>ballet slippers</span>,
          </span>
          <span>
            A <span id='scarfBird'>bird on a scarf</span>, and <span id='nailClippers'>fingernail clippers</span>;
          </span>
        </div>
        <div className='right-text'>
          <span>
            A <span id='rabbitMask'>bunny-rabbit mask</span>, a <span id='goldClock'>pretty gold clock</span>,
          </span>
          <span>
            A <span id='birthdayCandle'>birthday candle</span>, and a <span id='lockKey'>key that locks</span>.
          </span>
        </div>        
      </React.Fragment>
      }

      {id === 'i-spy-page-8-9' &&
      <React.Fragment>
        <div className='left-text'>
          <span>
            I spy a <span id='rabbit'>rabbit</span>, a <span id='icePopStick'>ice pop stick</span>,
          </span>
          <span>
            A <span id='sealBall'>seal on a ball</span>, and a <span id='dogBrick'>dog on a brick</span>;
          </span>
        </div>
        <div className='right-text'>
          <span>
            One <span id='redBottle'>red bottle</span>, one <span id='rubberBand'>rubber band</span>,
          </span>
          <span>
            A <span id='penny'>penny</span>, and the <span id='letterHand'>first letter in 'Hand'</span>.
          </span>
        </div>        
      </React.Fragment>
      }

      {id === 'i-spy-page-30-31' && 
      <React.Fragment>
        <div className='left-text'>
          <span>
            I spy a <span id='koalaBear'>koala bear</span>, a <span id='paperClip'>yellow paper clip</span>,
          </span>
          <span>
            An <span id='angel'>angel</span>, and a <span id='toyShip'>white toy ship</span>;
          </span>
        </div>
        <div className='right-text'>
          <span>
            A <span id='trainCar'>blue tran car</span>, a <span id='babyShoe'>pink baby shoe</span>,
          </span>
          <span>
            A <span id='spider'>spider</span>, and a <span id='blueHat'>hat that's blue</span>.
          </span>
        </div>        
      </React.Fragment>
      }
    </div>
  )
}

export default GameFooterText; 