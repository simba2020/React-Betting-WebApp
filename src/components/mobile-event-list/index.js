import React, { useState } from 'react';
import TournamentView from 'components/tournament-view';

const MobileEventList = ({ id, item, marketgroup, marketGroup, eventFav, clickEvent, addEventFavourite }) => {
  const [marketName, setMarketName] = useState(marketgroup[id]);

  const changeMarketName = (market) => {
    setMarketName(market);
    marketGroup(market, id);
  };

  return (
    <div>
      <div className="event-title ml-2 mt-2 mb-2">{item.displayName}</div>
      <div className="market-group-wrap">
        {Object.keys(item.commonMarketGroups).map((market, index) => (
          <div
            className={marketName === market ? 'market-group-unit p-2 market-group-active' : 'market-group-unit p-2'}
            key={index}
            onClick={() => changeMarketName(market)}
          >
            {item.commonMarketGroups[market]}
          </div>
        ))}
      </div>
      {item.items.map((entry, index) => (
        <TournamentView
          marketgroup={marketName}
          eventFav={eventFav}
          entry={entry}
          key={index}
          clickEvent={clickEvent}
          addEventFavourite={addEventFavourite}
        />
      ))}
    </div>
  );
};

export default MobileEventList;
