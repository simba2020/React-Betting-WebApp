import React from 'react';
import MarketGroup from 'components/sportsbook/marketGroup';
import Timer from 'components/timer';
import { getAssetUrl } from 'utils/EnvUtils';
import { Link } from 'react-router-dom';
import { FavouriteIcon } from 'components/favourite-icon';
import { useLocation } from 'react-router-dom';

const EventPanel = ({ entry, isPromotion, isFav, toggleFavorite, selected, isDragging = false }) => {
  const location = useLocation();

  return (
    <div className="game-carousel-unit mr-md-4 mr-2 cursor">
      <div className="top-icons-wrap pl-2 pr-2 pt-1 p-md-0">
        <div className="left-part">
          <div className="carousel-datetime">
            <Timer event={entry} livePage={entry.isLive} />
          </div>
          {entry.isLive ? (
            <img alt="live-img" id="live-img" className="ml-2" src={getAssetUrl('/interface/Live@2x.svg')} />
          ) : null}
        </div>
        {entry.hasCashout ? <img alt="cashout-img" className="cashout-img" id="cashout-img" /> : null}
        {entry.hasStats && <img alt="stat-img" id="stat-img" src={getAssetUrl('/interface/l-ic_statistics.svg')} />}
        <FavouriteIcon eventId={entry.id} isFav={isFav} clickFavIcon={toggleFavorite} />
      </div>
      <Link to={isDragging ? '#' : `/event/${entry.id}`}>
        <div className="row text-center content-wrap p-md-0 pr-1 justify-content-center">
          <div className="col-5 image-wrap pt-2">
            <img
              loading="lazy"
              src={getAssetUrl(isPromotion && location.pathname === '/' ? entry.gfx1 : entry.opponents[0].asset)}
              className="carousel-player-img"
              alt="player1"
            />
            <div className="player-name">{entry.opponents[0].name}</div>
          </div>
          {entry.opponents.length > 1 && (
            <div className="col-2 center-section p-0">
              {entry.isLive ? (
                <div className="score-line mt-3">
                  <div className="score-wrap mr-2">
                    <span>{entry.opponents[0].score}</span>
                  </div>
                  <div className="mt-1">:</div>
                  <div className="score-wrap ml-2">
                    <span>{entry.opponents[1].score}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-3">VS</div>
              )}
            </div>
          )}
          {entry.opponents.length > 1 && (
            <div className="col-5 image-wrap pl-0 pt-2">
              <img
                loading="lazy"
                src={getAssetUrl(isPromotion && location.pathname === '/' ? entry.gfx2 : entry.opponents[1].asset)}
                className="carousel-player-img second-player-img"
                alt="player2"
              />
              <div className="player-name">{entry.opponents[1].name}</div>
            </div>
          )}
        </div>
      </Link>
      <div className="row mx-0 carousel-odds">
        <MarketGroup
          eventId={entry.id}
          isPromotion={true}
          group={entry.marketGroups}
          onlyDefaults={true}
          selected={selected}
          key={selected}
        />
      </div>
    </div>
  );
};

export { EventPanel };
