import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Block from 'pages/sports/tournamentCollapse';
import ScrollContainer from 'react-indiana-drag-scroll';

import { EventPanel } from 'components/event-panel';
const Tournament = (props) => {
  const [collapse, setCollapse] = useState(true);

  const toggleFootball = () => {
    setCollapse(!collapse);
  };

  const data = props.data;

  return (
    <Block
      isOpen={collapse}
      onToggle={toggleFootball}
      data={data}
      sportName={data.entries[0].sportName}
      iconPath={props.allSports.entries[data.entries[0].sportCanonicalName].asset.path}
      marketgroup={props.marketgroup}
      marketgroup2={props.marketgroup2}
      eventName={data.entries[0].tournamentName}
      marketGroup={props.changeMarketGroup}
      marketGroup2={props.changeMarketGroup2}
    >
      <div>
        <div className="collapse-body pl-2 pr-2 pt-1">
          <ScrollContainer>
            <div className="flex sports-horizontal-events-wrap football-collapse">
              {data.entries.length !== 0 &&
                data.entries.map((entry, index) => (
                  <EventPanel entry={entry} isPromotion={window.location.pathname.includes('/live')} key={index} />
                ))}
            </div>
          </ScrollContainer>
        </div>
      </div>
    </Block>
  );
};

const mapStateToProps = (state) => ({
  allSports: state.event.allSports,
});

export default withRouter(connect(mapStateToProps, null)(Tournament));
