import React, { useState } from 'react';
import classes from './market-group-tab.module.scss';

const MarketGroupTab = ({ id, groups, marketgroup, changeMarketGroup }) => {
  const oddName = typeof marketgroup === 'string' ? marketgroup : Object.keys(groups)[id];

  const [marketName, setMarketName] = useState(oddName);
  const changeMarketName = (market) => {
    setMarketName(market);
    changeMarketGroup(market, id);
  };

  return (
    <div className={classes.market_group_wrap}>
      {Object.entries(groups)
        .slice(0, 5)
        .map(([key, val]) => (
          <div
            className={`p-2 ${classes.market_group_unit} ${marketName === key ? classes.market_group_active : ''}`}
            key={key}
            onClick={() => changeMarketName(key)}
          >
            {val}
          </div>
        ))}
    </div>
  );
};

export { MarketGroupTab };
