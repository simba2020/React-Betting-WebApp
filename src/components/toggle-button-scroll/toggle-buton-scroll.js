import React, { useEffect, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import ToggleButton from './toggle-button/toggle-button';

const ToggleButtonScroll = (props) => {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [data, props]);

  const selectItem = (id, selected) => {
    props.onSelect(id, selected);
  };

  return (
    <ScrollContainer vertical={false}>
      <div className="d-flex">
        {data.map((entry, index) => {
          return (
            <div className="mr-3" key={index}>
              <ToggleButton
                data={entry}
                selected={entry.selected}
                onSelect={selectItem}
              />
            </div>
          );
        })}
      </div>
    </ScrollContainer>
  );
};

export default ToggleButtonScroll;
