import React from 'react';
import renderDate from 'components/renderDate';

const MyTimer = ({ event, direction = true, livePage = false, inPlayIcon = false }) => {
  // const [timerRunning, setTimerRunning] = useState(event.timerRunning);
  //
  // useEffect(() => {
  //   /* needs to be updated with correct event name and data format */
  //   if (event.isLive) {
  //     eventBus.on(`TIMER_${event.id}`, (data) => {
  //       setTimerRunning(data);
  //     });
  //   }
  // });

  // if (event.isLive) {
  //   if (livePage) {
  //     return (
  //       <div className="d-inline time">
  //         <Timer
  //           formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
  //           initialTime={(event.roundStarted * 1000) / 24 / 3600}
  //           startImmediately={timerRunning}
  //           lastUnit="m"
  //         >
  //           {() => (
  //             <React.Fragment>
  //               <Timer.Minutes />'
  //             </React.Fragment>
  //           )}
  //         </Timer>
  //       </div>
  //     );
  //   } else {
  //     if (inPlayIcon) {
  //       return <img alt="live-img" id="live-img" src={getAssetUrl('/interface/Live@2x.svg')} />;
  //     }
  //   }
  // }
  if (direction) {
    return (
      <div className="d-inline">
        <span className="time">{renderDate(event.starts)}</span>
        <span className="time ml-1">{new Date(event.starts * 1e3).toTimeString().slice(0, 5)}</span>
      </div>
    );
  }

  return (
    <div className="datetime ml-0">
      <p className="numbers">{new Date(event.starts * 1e3).toTimeString().slice(0, 5)}</p>
      <p className="dates">{renderDate(event.starts)}</p>
    </div>
  );
};

export default MyTimer;
