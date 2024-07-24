import React from 'react';
import MarketGroup from 'components/sportsbook/marketGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Timer from 'components/timer';
import { getAssetUrl } from 'utils/EnvUtils';

import { FavouriteIcon } from 'components/favourite-icon';

const TournamentView = ({ entry, eventFav, marketgroup, clickEvent, addEventFavourite }) => {
  return (
    <div className="market-view">
      <div className="row">
        <div className="col-4">
          {entry.isLive && (
            <img
              src={window.location.origin + '/assets/image/market-view/Live@2x.svg'}
              className="mobile-live-img"
              alt="inplay_img"
            />
          )}
        </div>
        <div className="col-4 text-center d-flex align-items-center">
          <Timer event={entry} />
        </div>
        <div className="col-4 text-right">
          {entry.hasCashout && (
            <img src={getAssetUrl('/interface/l-ic_cashout.svg')} className="cashout-img" alt="img" />
          )}
          <FavouriteIcon eventId={entry.id} isFav={eventFav.includes(entry.id)} clickFavIcon={addEventFavourite} />
        </div>
      </div>
      <div className="row mt-3 justify-content-center align-items-center" onClick={() => clickEvent(entry.id)}>
        <div className="col-5 d-flex align-items-center justify-content-center text-right pr-0">
          <div className="col-9 p-0 name-wrap">
            <span className="team-name">{entry.opponents[0].name}</span>
          </div>
          <img
            src={getAssetUrl(entry.opponents[0].asset)}
            className="flag-img"
            style={{ marginLeft: '12px' }}
            alt="img"
          ></img>
        </div>
        <div className="col-2 p-0 text-center">
          <span className="score">
            {entry.isLive && (
              <span>
                {entry.opponents[0].score} : {entry.opponents.length > 1 && entry.opponents[1].score}
              </span>
            )}
          </span>
        </div>
        <div className="col-5 d-flex align-items-center justify-content-center text-left pl-0">
          {entry.opponents.length > 1 && (
            <img
              src={getAssetUrl(entry.opponents[1].asset)}
              className="flag-img"
              style={{ marginRight: '12px' }}
              alt="img"
            />
          )}
          <div className="col-9 p-0 name-wrap">
            {entry.opponents.length > 1 && <span className="team-name">{entry.opponents[1].name}</span>}
          </div>
        </div>
      </div>
      <div className="market-length-wrap pr-2" onClick={() => clickEvent(entry.id)}>
        <span className="length">+{Object.keys(entry.marketGroups).length}</span>
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      <div className="d-flex">
        <MarketGroup
          eventId={entry.id}
          group={entry.marketGroups}
          onlyDefaults={true}
          selected={marketgroup}
          key={marketgroup}
        />
      </div>
    </div>
  );
};

export default TournamentView;
