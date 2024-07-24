import React from 'react';
import { getAssetUrl } from 'utils/EnvUtils';

export const SportsItem = ({ item, clickAzSport }) => {
  return (
    <div className="p-3 mt-2 az-sport-click" onClick={() => clickAzSport(item.canonicalName)}>
      <img src={getAssetUrl(item.asset.path)} alt={item.name} />
      <p className="mt-0 ml-2">{item.name}</p>
      <p className="mt-0 ml-auto">{item.itemsCount}</p>
    </div>
  );
};
