import React from 'react';

import MarketGroup from 'components/sportsbook/marketGroup';
import Timer from 'components/timer';
import renderDate from 'components/renderDate';
import { getAssetUrl } from 'utils/EnvUtils';

const CouponRow = ({ match, selectedMarketGroup }) => {
  return (
    <>
      <div className="match-row d-md-flex d-none pt-2 pb-2 pl-md-3 mt-2">
        <div className="p-0 d-flex flex-md-column flex-column align-items-md-center overflow-hidden teams-column">
          <div className="w-100 pb-1">
            <div className="team d-flex align-items-center">
              <img src={getAssetUrl(match.opponents[0]?.asset)} alt="logo" />
              <div className="ml-2 d-flex align-items-center overflow-hidden">{match.opponents[0]?.name}</div>
            </div>
          </div>
          <div className="w-100 pt-1 ">
            <div className="team d-flex align-items-center">
              <img src={getAssetUrl(match.opponents[1]?.asset)} alt="logo" />
              <div className="ml-2 d-flex align-items-center overflow-hidden">{match.opponents[1]?.name}</div>
            </div>
          </div>
        </div>
        <div className="d-none p-0 text-center d-md-flex flex-column align-items-center justify-content-center timer-column">
          <Timer event={match} direction={false} />
        </div>
        <div className="d-flex inplay-body-all align-items-center cursor">
          {match.marketGroups[selectedMarketGroup] ? (
            <MarketGroup
              eventId={match.id}
              group={match.marketGroups[selectedMarketGroup]}
              onlyDefaults={false}
              key={selectedMarketGroup}
            />
          ) : (
            <MarketGroup
              eventId={match.id}
              group={match.marketGroups}
              onlyDefaults={true}
              key={selectedMarketGroup}
              selected={selectedMarketGroup}
            />
          )}
        </div>
      </div>
      <div className="d-md-none d-flex m-2 mobile">
        <div className="d-flex flex-column p-2 w-100 match">
          <div className="d-flex flex-row justify-content-between align-items-center w-100 match-header">
            <div className="d-flex align-items-center text-center col-5 p-0 team">
              <img src={getAssetUrl(match.opponents[0]?.asset)} alt="logo" />
              <div className="ml-2">{match.opponents[0]?.name}</div>
            </div>
            <div className="col-2">VS</div>
            <div className="d-flex align-items-center justify-content-between text-center col-5 p-0 team">
              <div>{match.opponents[1]?.name}</div>
              <img className="ml-2" src={getAssetUrl(match.opponents[1]?.asset)} alt="logo" />
            </div>
          </div>
          <div className="w-100 d-flex justify-content-between mt-2 kick-off">
            <div>Kick Off</div>
            <div>
              {new Date(match.starts * 1e3).toTimeString().slice(0, 5)} {renderDate(match.starts)}
            </div>
          </div>
          <div className="mt-2">
            {match.marketGroups[selectedMarketGroup] ? (
              <MarketGroup
                eventId={match.id}
                group={match.marketGroups[selectedMarketGroup]}
                onlyDefaults={false}
                key={selectedMarketGroup}
                mobile={true}
              />
            ) : (
              <MarketGroup
                eventId={match.id}
                group={match.marketGroups}
                onlyDefaults={true}
                key={selectedMarketGroup}
                selected={selectedMarketGroup}
                mobile={true}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { CouponRow };
