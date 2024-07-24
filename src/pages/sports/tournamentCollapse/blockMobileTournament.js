import React from 'react';
import Collapse from '@kunukn/react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import TournamentView from 'components/tournament-view';
import { getAssetUrl } from 'utils/EnvUtils';

const BlockMobileTournament = ({ isOpen, data, marketGroup, eventFav, marketgroup, eventName, sportName, iconPath, clickEvent, clearEventData, addEventFavourite }) => {
  const clickItem = (param) => {
    marketGroup(param);
  };
  let leagueName = eventName;
  const index = eventName.indexOf('.');
  if (index !== -1) {
    leagueName = eventName.substr(index + 2);
  }
  window.scrollTo(0, 0);

  return (
    <div className="block w-100 block-mobile-wrap">
      <div className="btn toggle row collapse-header mobile-collapse pl-0">
        <div className="text-left d-flex p-0" onClick={clearEventData}>
          <FontAwesomeIcon icon={faAngleLeft} className="mt-1" />
          <img src={getAssetUrl(iconPath)} className="mobile-sport-icon ml-1" alt="img" />
          <p className="bet-sport-name mt-1 ml-1">
            {sportName}: {data.entries && data.entries[0].countryName}
          </p>
        </div>
      </div>
      <Collapse isOpen={isOpen}>
        <div className="event-title ml-2 mt-2 mb-2">{leagueName}</div>
        <div className="market-group-wrap">
          {Object.keys(data.commonMarketGroups).map((market, index) => (
            <div className={marketgroup === market ? 'market-group-unit p-2 market-group-active' : 'market-group-unit p-2'} key={index} onClick={() => clickItem(market)}>
              {data.commonMarketGroups[market]}
            </div>
          ))}
        </div>
        <div className="pl-0 pr-md-2 pr-0">
          {data.entries.map((entry, index) => (
            <TournamentView marketgroup={marketgroup} eventFav={eventFav} entry={entry} key={index} clickEvent={clickEvent} addEventFavourite={addEventFavourite} />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default BlockMobileTournament;
