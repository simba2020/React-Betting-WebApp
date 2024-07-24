import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { PieChart } from 'react-minimal-pie-chart';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const InPlay = (props) => {
  const [show, setShow] = useState(false);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };

  let liveGameData = null;
  if (window.location.pathname.includes("/live") && !window.location.pathname.includes("/live/")){
    liveGameData = props.liveGameData;
  }else if (window.location.pathname.includes("/event")){
    liveGameData = props.eventData;
  }else {
    return null
  }

  if (liveGameData === null || !liveGameData.hasStats){
    return null;
  }

  return (
    <div id="betslip" className="mb-2">
      <div id="betslip-header" onClick={() => setShow(!show)}>
        <div className="d-md-flex d-none">
          <p className="p-3">In Play</p>
          <FontAwesomeIcon icon={show ? faChevronDown : faChevronUp} className="ml-auto mr-4 mt-auto mb-auto text-white" />
        </div>
        {
          show &&
          <div className="d-md-none d-block circle-collapse-btn" onClick={() => setShow(!show)}>
            <FontAwesomeIcon icon={faChevronDown} className="text-white" />
          </div>
        }
      </div>
      {
        (liveGameData !== null && Object.keys(liveGameData.stats).length > 1) &&
        <div id="inplay-body" className={show ? "d-none p-md-3 p-1" : "p-md-2 p-0 pb-2 pt-1"}>
          <div id="inplay-body-charts" className="p-md-2 p-0">
            <Carousel responsive={responsive} infinite={true} showDots={window.innerWidth > 600} arrows={false} autoPlay={true} autoPlaySpeed={5000}>
              {Object.keys(liveGameData.stats).map((stat, index) => (
                <div>
                  <div className="d-flex inplay-chart-unit">
                    <p className="ml-auto">{liveGameData.stats[stat].t1}</p>
                    <div className="p-md-1 p-0">
                      <PieChart
                        data={[
                          { value: Number(liveGameData.stats[stat].t1) === Number(liveGameData.stats[stat].t2) ? 50 : 100 - (Number(liveGameData.stats[stat].t1) / (Number(liveGameData.stats[stat].t1) + Number(liveGameData.stats[stat].t2))) * 100, color: window.innerWidth > 600?"#F9BE00": "white" },
                          { value: Number(liveGameData.stats[stat].t1) === Number(liveGameData.stats[stat].t2) ? 50 : (Number(liveGameData.stats[stat].t1) / (Number(liveGameData.stats[stat].t1) + Number(liveGameData.stats[stat].t2))) * 100, color: "#0DBAFB"},
                        ]}
                        lineWidth={20}
                        startAngle={270}
                      />
                    </div>
                    <p className="mr-auto">{liveGameData.stats[stat].t2}</p>
                  </div>
                  <p className="mt-1">{liveGameData.stats[stat].name}</p>
                </div>
              ))}
            </Carousel>
          </div>
          {!show &&
            <div className="arrowup-container d-md-none d-block">
              <div className="d-md-none d-block circle-collapse-btn btn-circle-arrowup" onClick={() => this.setState({ show: !show })}>
                <FontAwesomeIcon icon={faChevronUp} className="text-white" />
              </div>
            </div>
          }
        </div>
      }
    </div>
  );

}

const mapStateToProps = (state) => ({
  liveGameData: state.live.liveGameData,
  eventData: state.event.event,
});

export default withRouter(connect(mapStateToProps, null)(InPlay));
