import React from 'react';
import Collapse from '@kunukn/react-collapse';
import Down from 'components/collapseDown';
import { getAssetUrl } from 'utils/EnvUtils';

const BlockTournament = ({ isOpen, onToggle, children, data, sportName, iconPath }) => {
  return (
    <div className="block w-100 mb-1">
      <div className="btn toggle row collapse-header">
        <div className="col-xl-6 col-md-6 col-8 text-left d-flex p-0" onClick={onToggle}>
          <img src={getAssetUrl(iconPath)} className="mt-1" alt="img" />
          <p className="bet-sport-name mt-2 ml-2 text-uppercase">{sportName}: </p>
          <p className="bet-sport-name mt-2 ml-2">{data.name}</p>
        </div>
        <div className="col-xl-6 col-md-6 col-4 d-flex justify-content-end p-0">
          <div className="w-20 p-0 text-right" onClick={onToggle}>
            <Down isOpen={isOpen} />
          </div>
        </div>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </div>
  );
};

export default BlockTournament;
