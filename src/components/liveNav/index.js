import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Timer from 'components/timer';
import { setCollapseLive, collapseLive, clearCollapseLive } from 'redux/actions';
import MarketGroup from 'components/sportsbook/marketGroup';
import Block from './liveNavBlock';

const LiveNav = (props) => {
  const { data, clearCollapseLive, setCollapseLive, collapseLive, changeActiveGame } = props;

  const [order, setOrder] = useState('first');

  useEffect(() => {
    clearCollapseLive();
    setCollapseLive(data);
  }, [clearCollapseLive, setCollapseLive, data]);

  const toggleLiveNav = (id) => {
    collapseLive(id);
    setOrder('first');
  };

  const clickActiveGame = (order, id) => {
    setOrder(order);
    changeActiveGame(id);
  };

  const renderItems = (params, sport) => {
    return Object.keys(params).map((param, index) => (
      <div
        className="live-nav-item p-2 mt-2 pl-3"
        key={index}
        onClick={() => props.setTournament('events/' + sport + '/' + params[param].id)}
      >
        <p>{params[param].name}</p>
        <p className="ml-auto">{params[param].count}</p>
      </div>
    ));
  };

  return (
    <div className="col-md-3 col-12 pr-0 pl-0">
      <div id="live-games" className="p-2 d-flex mb-2">
        <p className="ml-2 mt-1">Live Games</p>
      </div>
      <div>
        {data.map((nav, index) => (
          <Block key={index} data={nav} isOpen={props.collapse_live[index]} onToggle={() => toggleLiveNav(index)}>
            {nav.itemsPromoted.length !== 0 ? (
              <div id="live-game-detail-body" className="pl-2 pr-2 pt-2 pb-0">
                <div
                  id="live-game-detail-first"
                  className={order === 'first' ? 'active-live-game mb-2' : 'mb-2'}
                  onClick={() => clickActiveGame('first', nav.itemsPromoted[0].id)}
                >
                  <div className="d-flex pt-2 pb-1 pl-3 pr-3">
                    <p className="live-game-detail-team">{nav.itemsPromoted[0].opponents[0].name}</p>
                    <p className="live-game-detail-yellow">{nav.itemsPromoted[0].opponents[0].score}</p>
                  </div>
                  <div className="d-flex p-1 pl-3 pr-3">
                    <p className="live-game-detail-team">{nav.itemsPromoted[0].opponents[1].name}</p>
                    <p className="live-game-detail-yellow">{nav.itemsPromoted[0].opponents[1].score}</p>
                  </div>
                  <div className="pl-3 pt-1 pb-1 pr-3">
                    <Timer event={nav.itemsPromoted[0]} livePage={true} />
                  </div>
                  <MarketGroup
                    eventId={nav.itemsPromoted[0].id}
                    group={nav.itemsPromoted[0].marketGroups[0]}
                    onlyDefaults={false}
                  />
                </div>
                {nav.itemsPromoted[1] !== undefined ? (
                  <div
                    id="live-game-detail-second"
                    className={order === 'second' ? 'active-live-game' : ''}
                    onClick={() => clickActiveGame('second', nav.itemsPromoted[1].id)}
                  >
                    <div className="d-flex pt-2 pb-1 pl-3 pr-3">
                      <p className="live-game-detail-team">{nav.itemsPromoted[1].opponents[0].name}</p>
                      <p className="live-game-detail-yellow">{nav.itemsPromoted[1].opponents[0].score}</p>
                    </div>
                    <div className="d-flex p-1 pl-3 pr-3">
                      <p className="live-game-detail-team">{nav.itemsPromoted[1].opponents[1].name}</p>
                      <p className="live-game-detail-yellow">{nav.itemsPromoted[1].opponents[1].score}</p>
                    </div>
                    <div className="pl-3 pt-1 pb-1 pr-3">
                      <Timer event={nav.itemsPromoted[1]} livePage={true} />
                    </div>
                    <MarketGroup
                      eventId={nav.itemsPromoted[1].id}
                      group={nav.itemsPromoted[1].marketGroups[0]}
                      onlyDefaults={false}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="pl-2 pr-2">{renderItems(nav.items, nav.id)}</div>
          </Block>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapse_live: state.live.collapse_live,
});

const mapDispatchToProps = (dispatch) => ({
  setCollapseLive: (payload) => dispatch(setCollapseLive(payload)),
  collapseLive: (payload) => dispatch(collapseLive(payload)),
  clearCollapseLive: (payload) => dispatch(clearCollapseLive(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LiveNav));
