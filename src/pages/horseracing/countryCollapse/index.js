import React from 'react';
import Collapse from '@kunukn/react-collapse';
import Down from 'components/collapseDown';

const Block = (props) => {
  const { onToggle, countryName, isOpen, children } = props;

  return (
    <div className="mb-2">
      <div className="country-unit-header p-2 mb-1" onClick={onToggle}>
        <p className="ml-2 mt-1">{countryName}</p>
        <div className="ml-auto">
          <Down isOpen={isOpen} />
        </div>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </div>
  );
};

export default Block;
