import React from 'react';
import Env from 'utils/Env';

const Message = (props) => {
  const goBack = () => {
    props.history.goBack();
  };

  const height = window.innerHeight - 122;

  return (
    <div className="d-md-none d-block h-100 bet-hisotry-div">
      <div className="d-flex justify-content-bewteen header">
        <div className="back d-flex align-items-center" onClick={() => goBack()}>
          <img src={window.location.origin + '/assets/image/header/left_arrow.svg'} id="left_arrow" alt="arrow" />
          Back
        </div>
        <img src={window.location.origin + '/assets/image/logo.svg'} id="logo" alt="logo" />
      </div>
      <iframe
        src={Env.URL + '#message'}
        width="100%"
        style={{ height: height + 'px', border: 'none' }}
        title="history"
      ></iframe>
      ;
    </div>
  );
};

export default Message;
