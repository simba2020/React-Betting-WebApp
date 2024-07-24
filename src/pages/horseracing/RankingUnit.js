import React, { useEffect, useState } from 'react';
import Market from 'components/sportsbook/market';
import { useHistory } from 'react-router-dom';
import { getAssetUrl } from 'utils/EnvUtils';

const RankingUnit = ({ ranking_unit }) => {
  console.log(ranking_unit);

  const current = new Date().getTime();
  const [minute, setMinute] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => setMinute(minute + 1), 1000 * 60);

    return () => clearTimeout(timer);
  });

  const renderMarkets = (markets, stats) => {
    if (!Array.isArray(markets)) {
      return null;
    }

    markets.sort((a, b) => (Number(a.rate) > Number(b.rate) ? 1 : Number(b.rate) > Number(a.rate) ? -1 : 0));

    return markets.map((item, index) => {
      let icon = getAssetUrl('/interface/Siclk_5.svg');
      let img = null;
      let titleClass = 'col-9 p-0';

      if (stats[item.sref] !== undefined && stats[item.sref].slk !== null) {
        icon = getAssetUrl(stats[item.sref].slk);
        img = <img alt={item.name} src={icon} className="silk p-0" onClick={() => goToDetail()} />;
        titleClass = 'p-0';
      }

      return index < 3 ? (
        <div className="row m-0 mb-2 align-items-center" key={index}>
          <div className="d-flex pl-0 align-items-center col-9" style={{ height: '56px' }} onClick={() => goToDetail()}>
            {img}
            <div className={titleClass}>
              <p className="ml-2">{item.name}</p>
            </div>
          </div>
          <div className="text-center p-0 col-3">
            <Market
              eventId={ranking_unit.id}
              odds={item}
              inRow={1}
              useDefaults={true}
              title={item.name}
              index={index}
              key={index}
            />
          </div>
        </div>
      ) : null;
    });
  };

  const goToDetail = () => {
    history.push(`/horseracing/detail/${ranking_unit.id}`);
  };

  return (
    <div className="cursor">
      <div className="d-flex mb-2" onClick={goToDetail}>
        <p className="date-time mr-2">{ranking_unit.opponentsFulltext + ' | '}</p>
        <p className="date-time mr-2">{new Date(ranking_unit.starts * 1e3).toTimeString().slice(0, 5)}</p>
        {ranking_unit.starts - current / 1000 < 3600 ? (
          <p className="distance">
            {new Date(ranking_unit.starts * 1000).getMinutes() > new Date().getMinutes()
              ? new Date(ranking_unit.starts * 1000).getMinutes() - new Date().getMinutes() + 'm'
              : new Date(ranking_unit.starts * 1000).getMinutes() + 60 - new Date().getMinutes() + 'm'}
          </p>
        ) : null}
      </div>
      <div>{renderMarkets(ranking_unit.marketGroups['Winner']?.markets, ranking_unit.stats)}</div>
      <div className="view-race-card" onClick={() => goToDetail()}>
        View racecard
      </div>
    </div>
  );
};

export default RankingUnit;
