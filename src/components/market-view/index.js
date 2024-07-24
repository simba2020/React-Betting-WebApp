import React from 'react';
import MarketGroup from 'components/sportsbook/marketGroup';
import { getAssetUrl } from 'utils/EnvUtils';

const MarketView = ({ entry }) => {
  return (
    <div className="market-view ml-2" style={{ minHeight: '163px' }}>
      <div className="row">
        <div className="col-4">
          {entry.isLive && <img src={'/assets/image/market-view/Live@2x.svg'} alt="inplay_img" />}
        </div>
        <div className="col-4 text-center">
          <span className="time">{new Date(entry.starts * 1e3).toTimeString().slice(0, 5)}</span>
        </div>
        <div className="col-4 text-right">
          <img src={getAssetUrl('/interface/l-ic_cashout.svg')} className="cashout-img" alt="img" />
          <img src={'/assets/image/market-view/Ic_favorite.svg'} alt="star_img" />
        </div>
      </div>
      <div className="row align-items-center justify-content-between mt-3 ml-0 mr-0">
        <div className="align-items-center justify-content-end col-5 d-flex pl-0 pr-0 text-right overflow-hidden">
          <span className="team-name">{entry.opponents[0].name}</span>
          <img src={getAssetUrl(entry.opponents[0].asset)} className="flag-img ml-2 mr-1" alt="img" />
        </div>
        <div className="align-items-center d-flex justify-content-center pl-0 pr-0 text-center">
          <span className="score">
            {entry.opponents[0].score} : {entry.opponents[1].score}
          </span>
        </div>
        <div className="align-items-center col-5 d-flex pl-0 pr-0 text-left overflow-hidden">
          <img src={getAssetUrl(entry.opponents[1].asset)} className="flag-img mr-2 ml-1" alt="img" />
          <span className="team-name">{entry.opponents[1].name}</span>
        </div>
      </div>
      <div className="market-group ml-0 mr-0">
        <MarketGroup
          eventId={entry.id}
          isPromotion={true}
          group={entry.marketGroups}
          onlyDefaults={true}
          selected={Object.keys(entry.marketGroups)[0]}
          key={Object.keys(entry.marketGroups)[0]}
        />
      </div>
    </div>
  );
};

export default MarketView;
