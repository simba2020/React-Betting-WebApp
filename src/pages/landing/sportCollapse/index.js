import React from 'react';
import Collapse from '@kunukn/react-collapse';
import Down from 'components/collapseDown';
import { getAssetUrl } from 'utils/EnvUtils';
import { MarketGroupTab } from 'components/market-group-tab';

const Block = ({ isOpen, item, onToggle, children, id, changeMarketGroup, marketgroup }) => {
  const combinedGroups = Object.entries({ ...item.mgs.first, ...item.mgs.second })
    .slice(0, 5)
    .reduce((accu, [key, value]) => ({ ...accu, [key]: value }), {});

  return (
    <div className="block w-100 collapse-homepage mb-1" id={id}>
      <div className="btn toggle row collapse-header" id={item.canonicalName}>
        <div className="col-md-5 col-8 text-left d-flex p-0 align-items-center" onClick={onToggle}>
          <img src={getAssetUrl(item.asset.path)} alt="img" />
          <p className="bet-sport-name ml-2">{item.name}</p>
        </div>
        <div className="col-md-7 col-4 row p-0 m-0 d-md-flex d-block">
          <div className="col-11 p-0 m-0 d-md-block d-none">
            <div className="market-tap">
              <MarketGroupTab
                id={id}
                groups={combinedGroups}
                changeMarketGroup={changeMarketGroup}
                marketgroup={marketgroup}
              />
            </div>
          </div>
          <div className="col-1 p-0 text-right float-right mr-md-0 mr-2" onClick={onToggle}>
            <Down isOpen={isOpen} />
          </div>
        </div>
      </div>
      <Collapse isOpen={isOpen} id={!isOpen ? '' : 'setHeight'}>
        {children}
      </Collapse>
    </div>
  );
};

export default Block;
