import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PieChart } from 'react-minimal-pie-chart';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const LinearInPlay = (props) => {
  const getStatValue = (stat, index) => {
    const t1 = liveGameData.stats[stat].t1;
    const t2 = liveGameData.stats[stat].t2;
    if (t1 === t2) {
      return 50;
    }

    let value;
    if (index === 0) {
      value = 100 - (t1 / (t1 + t2)) * 100;
    } else {
      value = (t1 / (t1 + t2)) * 100;
    }

    return value;
  };

  let liveGameData = null;
  if (window.location.pathname.includes('/live') && !window.location.pathname.includes('/live/')) {
    liveGameData = props.liveGameData;
  } else if (window.location.pathname.includes('/event')) {
    liveGameData = props.eventData;
  } else {
    return null;
  }

  if (liveGameData === null || !liveGameData.hasStats) {
    return null;
  }

  const statsTotalCount = Object.keys(liveGameData.stats).length;

  const responsive = {
    quadHighDesktop: {
      breakpoint: { max: 3840, min: 2561 },
      items: statsTotalCount > 6 ? 6 : statsTotalCount,
    },
    highDesktop: {
      breakpoint: { max: 2560, min: 1921 },
      items: statsTotalCount > 5 ? 5 : statsTotalCount,
    },
    desktop: {
      breakpoint: { max: 1920, min: 1281 },
      items: statsTotalCount > 4 ? 4 : statsTotalCount,
    },
    tablet: {
      breakpoint: { max: 1280, min: 769 },
      items: statsTotalCount > 3 ? 3 : statsTotalCount,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="mb-2">
      {liveGameData !== null && Object.keys(liveGameData.stats).length > 1 && (
        <div className="linear-inplay-body">
          <Carousel
            responsive={responsive}
            arrows={false}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            transitionDuration={30000}
            customTransition="transform 2000ms ease-in-out"
          >
            {Object.keys(liveGameData.stats).map((stat, index) => (
              <div key={index} className="linear-inplay-wrap">
                <div className="item-chart-unit">
                  <span className="stat-name">{liveGameData.stats[stat].name}</span>
                  <div className="chart">
                    <PieChart
                      data={[
                        {
                          value: getStatValue(stat, 0),
                          color: window.innerWidth > 600 ? '#F9BE00' : 'white',
                        },
                        {
                          value: getStatValue(stat, 1),
                          color: '#0DBAFB',
                        },
                      ]}
                      lineWidth={20}
                      startAngle={270}
                    />
                  </div>

                  <span className="number-wrap">
                    <span>{liveGameData.stats[stat].t1}</span>
                    <span>:</span>
                    <span>{liveGameData.stats[stat].t2}</span>
                  </span>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  liveGameData: state.live.liveGameData,
  eventData: state.event.event,
});

export default withRouter(connect(mapStateToProps, null)(LinearInPlay));
