import React, { useState } from "react";
import { useSelector } from 'react-redux';
import Down from "../collapseDown";
import BetSlip from "../betslip";

const CollapseBetslip = () => {
  const [collapse, setCollapse] = useState(false);
  const profileFlag = useSelector(state => state.landing.profileFlag);
  const singleBets = useSelector(state => state.betslip.betslip_single_bets);

  const changeCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <div>
      {
        profileFlag !== null ? (
          null
        ) : (
          <div className="collapse-betslip-container">
            <div className="collapse-header-wrap justify-content-between d-flex p-2 drag">
              <div className="d-flex">
                <img src={window.location.origin + "/assets/image/footer/Icon_betslip.svg"} alt="img" />
                <span className="betslip-title mt-2 ml-2">Betslip</span>
                <span className="betslip-count mt-2 ml-1">{singleBets.length ? `(${singleBets.length})` : ''}</span>
              </div>
              <div className="down" onClick={changeCollapse}>
                <Down isOpen={collapse} />
              </div>
            </div>
            {
              collapse && <BetSlip isDraggable={true} />
            }
          </div>
        )
      }
    </div>
  );
};

export default CollapseBetslip;
