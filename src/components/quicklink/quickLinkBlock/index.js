import React from 'react';
import Collapse from '@kunukn/react-collapse';
import { getAssetUrl } from 'utils/EnvUtils';

const Block = ({ regionName, active, data, isOpen, onToggle, children }) => {
  const blockClasses = active ? 'quick-unit p-2 quick-unit-active' : 'quick-unit p-2';

  return (
    <div className="block collapse-quick-link">
      <div onClick={onToggle}>
        <div className={blockClasses}>
          <img src={getAssetUrl(data.items[regionName].flag.path)} className="mr-3" alt={regionName + 'img'} />
          <p>{data.items[regionName].name}</p>
          <p className="ml-5 d-md-block d-none ">{data.items[regionName].tournaments.length}</p>
        </div>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </div>
  );
};

export default Block;
