import React from 'react';
import { getAssetUrl } from 'utils/EnvUtils';

const ToggleButton = (props) => {
  const { data } = props;

  const toggleActive = () => {
    props.onSelect(data.id, !data.selected);
  };

  const normalStyle = 'd-flex align-items-center cursor toggle-btn p-2';

  return (
    <div className={data.selected ? `${normalStyle} clicked` : normalStyle} onClick={toggleActive}>
      <img src={getAssetUrl(data?.asset?.path)} alt="icon" />
      <span className="ml-3">{data.name}</span>
      <span className="ml-5">{data?.count}</span>
    </div>
  );
};

export default ToggleButton;
