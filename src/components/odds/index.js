import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { setOdd } from "redux/actions";

const Odds = (props) => {
  const [show, setShow] = useState(true);

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const clickItem = (odd) => {
    localStorage.setItem("odd", odd);
    props.setOdd(odd);
  };


  const handleClickOutside = (event) => {
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  const oddsArray = ["American (+120)", "Fractional (6/5)", "Decimal (2.20)"];

    return (
      <div className="d-flex">
        <div id="odd-selector">
          <div className="marketgroup-dropdown" ref={wrapperRef}>
            {show ? (
              <div className="marketgroup-dropdown-body p-1">
                <div className="odds-title m-2">Odds Format</div>
                {oddsArray.map((odd, index) => (
                  <div className={props.odd === odd ? "dropdown-body-item mt-1 selected-item" : "dropdown-body-item mt-1"} key={index} onClick={() => clickItem(odd)}>
                    <img src={props.odd === odd ? window.location.origin + "/assets/image/header/radio_button_checked-24px.svg" : window.location.origin + "/assets/image/header/radio_button_unchecked-24px.svg"} className="img-radio mt-2 ml-1" alt="radio_img" />
                    <p>{odd}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
}

const mapStateToProps = (state) => ({
  odd: state.football.odd,
});

const mapDispatchToProps = (dispatch) => ({
  setOdd: (payload) => dispatch(setOdd(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Odds));
