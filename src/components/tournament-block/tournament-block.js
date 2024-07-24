import React from 'react';
import Collapse from '@kunukn/react-collapse';
import Down from 'components/collapseDown';
import { getAssetUrl } from 'utils/EnvUtils';
import classes from './tournament-block.module.scss';
import { MarketGroupTab } from 'components/market-group-tab';

const TournamentBlock = ({ id, isOpen, data, allEntries, onToggle, children, changeMarketGroup, marketgroup }) => {
  const combinedGroups = Object.entries({ ...data.mgs.first, ...data.mgs.second })
    .slice(0, 5)
    .reduce((accu, [key, value]) => ({ ...accu, [key]: value }), {});

  return (
    <div className={`mb-md-0 mb-5 ${classes.block_container}`}>
      <div className={`btn toggle row ${classes.block_collapse_header}`}>
        <div className="col-xl-6 col-md-6 col-8 text-left d-flex p-0" onClick={onToggle}>
          {allEntries.items[data.countryCanonicalName] && (
            <img
              src={getAssetUrl(allEntries.items[data.countryCanonicalName].flag.path)}
              className="mt-2"
              alt="country-img"
            />
          )}
          <p className="bet-sport-name mt-2 ml-2">{data.countryName}</p>
        </div>
        <div className="col-xl-6 col-md-6 col-4 d-flex justify-content-end p-0 h-100">
          <div className="market-tap d-md-block d-none">
            <MarketGroupTab
              id={id}
              groups={combinedGroups}
              changeMarketGroup={changeMarketGroup}
              marketgroup={marketgroup}
            />
          </div>
          <div className="w-5 p-0 text-right mt-1" onClick={onToggle}>
            <Down isOpen={isOpen} />
          </div>
        </div>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </div>
  );
};

export { TournamentBlock };
