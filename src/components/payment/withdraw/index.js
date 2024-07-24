import React from 'react';
import Env from 'utils/Env';

const Withdraw = (props) => {
  const goBack = () => {
    props.history.goBack();
  };

  const height = window.innerHeight - 48;

  return (
    <div className="h-100 d-md-none d-block bet-hisotry-div">
      <div className="d-flex justify-content-bewteen header">
        <div className="back d-flex align-items-center" onClick={() => goBack()}>
          <img src={window.location.origin + '/assets/image/header/left_arrow.svg'} id="left_arrow" alt="arrow" />
          Back
        </div>
        <img src={window.location.origin + '/assets/image/logo.svg'} id="logo" alt="logo" />
      </div>
      <iframe
        src={Env.URL + '#payment/withdraw'}
        width="100%"
        style={{ height: height + 'px', border: 'none' }}
        title="payment"
      ></iframe>
    </div>
  );
};

export default Withdraw;
