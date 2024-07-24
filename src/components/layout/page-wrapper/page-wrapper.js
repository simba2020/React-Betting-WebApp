import React from 'react';
import BetSlip from 'components/betslip';
import Casino from 'components/casino';

import Draggable from "react-draggable";
import CollapseBetslip from "components/collapse-betslip";
import classes from './page-wrapper.module.scss';
import { Tablet } from 'components/media-queries';

const HeaderStyle = Object.freeze({
  TALL: classes.header_tall,
  LOW: classes.header_low,
});

const PageWrapper = ({ betslip, casino, children, headerStyle = HeaderStyle.LOW }) => {

  return (
    <div className={`${classes.page_wrapper} d-flex`}>
      <div className="col-xl-749 col-12 pr-md-4 pl-0 pr-0 ml-md-3">{children}</div>
      {(betslip || casino) && (
        <>
          <div id="betslip_casino" className={`col-xl-251 col-12 d-xl-block d-none pl-0 bs-right-padding ${headerStyle}`}>
            <BetSlip />
            <Casino />
          </div>

          <div className="draggable-component">
            <Tablet>
              <Draggable handle=".drag" cancel=".down" defaultPosition={{ x: 0, y: 100 }}>
                <div >
                  <CollapseBetslip />
                </div>
              </Draggable>
            </Tablet>
          </div>
        </>
      )}
    </div>
  );
};

export { PageWrapper, HeaderStyle };
