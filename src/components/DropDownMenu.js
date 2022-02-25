import './DropDownMenu.css';
import React from 'react';

const DropDownMenu = (props) => {
  const { xPercent, yPercent, reverseMenu, checkForMatch, objectList } = props;

  const wrapperStyle = {
    top: yPercent + '%',
    left: xPercent + '%'
  };

  const wrapperClassName = reverseMenu 
    ? ['drop-down-menu-wrapper', 'reverse']
    : ['drop-down-menu-wrapper'];

  return (
    <div style={wrapperStyle} className={wrapperClassName.join(' ')}>
      <ul>
        {objectList.map((element) => 
          !element.match 
            ? <li key={element.id} id={element.id} onClick={checkForMatch}>{element.text}</li>
            : false
        )}
      </ul>
    </div>
  )
}

export default DropDownMenu