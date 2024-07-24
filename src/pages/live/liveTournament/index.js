import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  fetchFavoriteEvents,
  fetchFavoriteOpponents,
  saveLiveGameData,
  toggleFavoriteEvent,
  toggleFavoriteOpponent,
} from 'redux/actions';
import { selectFavoriteEvents, selectFavoriteOpponents, selectUserInfo } from 'redux/selectors/user';
import SportService from 'services/SportService';
import LiveNav from 'components/liveNav';
import Timer from 'components/timer';
import MarketGroup from 'components/sportsbook/marketGroup';
import Tournament from 'components/tournament';
import { JumpingDots } from 'components/jumping-dots';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import BlockMobileTournament from 'pages/sports/tournamentCollapse/blockMobileTournament';
import { getAssetUrl } from 'utils/EnvUtils';
import { FavouriteIcon } from 'components/favourite-icon';

class LiveTournament extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      events: null,
      marketgroup: '',
      marketgroup2: '',
      allSports: null,
      leftIconNaturalWidth: 0,
      rightIconNaturalWidth: 0,
      sportName: '',
      tournamentName: '',
    };
    this.tempEvents = null;
    this.leftTeamIconRef = React.createRef();
    this.rightTeamIconRef = React.createRef();
  }

  componentDidMount() {
    this.props.history.push({ search: '' });
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    SportService.getLiveNav()
      .then((res) => {
        this.setState({ liveNav: res.data, loading: false });
      })
      .catch(() => {});

    const { sport, tournament } = this.props.match.params;
    this.setState({
      sportName: sport,
      tournamentName: tournament,
    });
    this.setTournament(`events/${sport}/${tournament}`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps === undefined) {
      return false;
    }
    if (
      this.state.sportName !== this.props.match.params.sportName ||
      this.state.tournamentName !== this.props.match.params.tournamentName
    ) {
      if (this.props.match.params.sportName && this.props.match.params.tournamentName) {
        this.setState({
          sportName: this.props.match.params.sportName,
          tournamentName: this.props.match.params.tournamentName,
        });
        this.setTournament(`events/${this.props.match.params.sportName}/${this.props.match.params.tournamentName}`);
      }
    }
  }

  handleResize = () => {
    if (window.innerWidth > 600) {
      this.props.history.push({ search: '' });
    }
  };

  getEvents = (id) => {
    const { isLoggedIn } = this.props.userInfo;

    SportService.getEvent(id)
      .then((res) => {
        // TODO Remove!
        if (window.innerWidth < 600) {
          this.props.history.push({
            search: '?mobile-tournaments',
          });
        }
        this.props.saveLiveGameData(res.data);
        if (isLoggedIn) {
          this.props.fetchFavoriteOpponents(res.data.opponents.map((o) => o.id));
        }
        this.setState({
          data: res.data,
        });
      })
      .catch(() => {});
  };

  setEventId = (e) => {
    this.setState({ events: null });
    if (this.state.liveNav[e].itemsPromoted[0] !== undefined) {
      const id = this.state.liveNav[e].itemsPromoted[0].id;
      this.getEvents(id);
    } else {
      this.setState({
        data: null,
      });
    }
  };
  static getDerivedStateFromProps(props) {
    if (props.allSports !== null) {
      return {
        allSports: props.allSports,
      };
    }

    return null;
  }

  setTournament = (id) => {
    SportService.getLiveEvents(id)
      .then((res) => {
        if (window.innerWidth < 600) {
          this.props.history.push({
            search: '?mobile-tournaments',
          });
        }
        this.setState({
          events: res.data,
          marketgroup: Object.keys(res.data.commonMarketGroups)[0],
          marketgroup2: Object.keys(res.data.commonMarketGroups)[1],
        });
        const liveTournamentUrl = `/${res.data.entries[0].sportCanonicalName}/${res.data.entries[0].tournamentCanonicalName}`;
        this.props.history.push('/live' + liveTournamentUrl);
      })
      .catch(() => {});
  };

  clickEvent = (id) => {
    this.tempEvents = this.state.events;
    this.setState({ events: null, data: null });
    this.props.history.push('/live/event/' + this.tempEvents.entries[0].id);
  };

  changeMarketGroup = (e) => {
    this.setState({ marketgroup: e });
  };

  changeMarketGroup2 = (e) => {
    this.setState({ marketgroup2: e });
  };

  changeActiveGame = (id) => {
    this.setState({ data: null, events: null });
    this.props.history.push('/live/event/' + id);
  };

  clearEventData = () => {
    this.props.history.push('/live');
  };

  backTournamentPage = () => {
    if (this.tempEvents === null) {
      this.props.history.push({ search: '' });
      this.setState({ data: null });
    } else {
      this.setState({ data: null, events: this.tempEvents });
    }
  };

  addEventFavourite = (id) => {
    this.props.toggleFavoriteEvent(id);
  };

  handleLeftImageLoaded = () => {
    this.setState({ leftIconNaturalWidth: this.leftTeamIconRef.current.naturalWidth });
  };

  handleRightImageLoaded = () => {
    this.setState({ rightIconNaturalWidth: this.rightTeamIconRef.current.naturalWidth });
  };

  render() {
    if (this.state.loading) {
      return <JumpingDots />;
    }
      const entry = this.state.data;
      const data = this.state.events;
      const allSports = this.state.allSports;

      if (allSports === null) {
        return null;
      }

      return (
        <div>
          <div className="row d-flex ml-0 mr-0 pt-112">
            <div className="col-12">
              <div className="row">
                {this.props.location.search === '' && window.innerWidth > 600 && (
                  <LiveNav
                    data={this.state.liveNav}
                    setEventId={this.setEventId}
                    setTournament={this.setTournament}
                    changeActiveGame={this.changeActiveGame}
                  />
                )}
                {data !== null && data.entries.length ? (
                  <div className="col-md-9 col-12 pl-md-2 pr-md-2 p-0">
                    <div className="d-md-block d-none">
                      <Tournament
                        data={data}
                        marketgroup={this.state.marketgroup}
                        changeMarketGroup={this.changeMarketGroup}
                        marketgroup2={this.state.marketgroup2}
                        changeMarketGroup2={this.changeMarketGroup2}
                        eventFav={this.props.favEvents}
                        clickEvent={this.clickEvent}
                        addEventFavourite={this.addEventFavourite}
                      />
                    </div>
                    <div className="d-md-none d-block">
                      <BlockMobileTournament
                        isOpen={true}
                        data={data}
                        marketgroup={this.state.marketgroup}
                        sportName={data.entries[0].sportName}
                        eventName={data.entries[0].tournamentName}
                        marketGroup={this.changeMarketGroup}
                        clearEventData={this.clearEventData}
                        eventFav={this.props.favEvents}
                        iconPath={allSports.entries[data.entries[0].sportCanonicalName].asset.path}
                        clickEvent={this.clickEvent}
                        addEventFavourite={this.addEventFavourite}
                      />
                    </div>
                  </div>
                ) : entry !== null ? (
                  <div className="col-md-9 col-12 pl-md-2 p-0 pr-2">
                    <div id="inplay-header" className="p-2 d-flex mb-2" onClick={this.backTournamentPage}>
                      <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                      <p className="mb-0">
                        <span className="d-md-inline d-none">In play - </span>
                        {entry.sportName} - {entry.tournamentName}
                      </p>
                    </div>
                    <div id="inplay-board" className="p-md-3 p-1 mb-2">
                      <div className="row">
                        <div className="col-4">
                          {entry.isLive ? (
                            <img
                              src={window.location.origin + '/assets/image/market-view/Live@2x.svg'}
                              className="float-left mt-1 d-md-none d-block"
                              alt="img"
                            />
                          ) : null}
                        </div>
                        <div className="col-4 text-center">
                          <Timer event={entry} livePage={true} />
                        </div>
                        <div className="col-4">
                          {entry.hasCashout ? (
                            <img
                              src={getAssetUrl('/interface/l-ic_cashout.svg')}
                              className="d-md-none d-block float-right"
                              alt="img"
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="row w-100 m-0 p-0 mt-1">
                        <div className="col-md-5 col-5 p-0">
                          <div className="d-flex float-right">
                            {entry.hasCashout ? (
                              <img
                                src={getAssetUrl('/interface/l-ic_cashout.svg')}
                                className="h-100 d-md-block d-none"
                                alt="img"
                              />
                            ) : null}
                            <FavouriteIcon
                              eventId={entry.opponents[0].id}
                              isFav={this.props.favOpponents.includes(entry.opponents[0].id)}
                              clickFavIcon={this.props.toggleFavoriteOpponent}
                            />
                            <div className="d-flex mt-md-3 mt-0 inplay-board-team">
                              <p className="mt-md-2 mt-1 mb-md-4 mb-0">{entry.opponents[0].name}</p>
                              <img
                                src={getAssetUrl(entry.opponents[0].asset)}
                                className={this.state.leftIconNaturalWidth > 20 ? 'ml-2' : 'empty-img'}
                                alt="img"
                                ref={this.leftTeamIconRef}
                                onLoad={this.handleLeftImageLoaded}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2 col-2 p-0">
                          {entry.isLive ? (
                            <div id="inplay-board-score" className="text-center mt-md-2 mt-0">
                              {entry.opponents.length > 1 && (
                                <p className="mb-2">
                                  {entry.opponents[0].score} : {entry.opponents[1].score}
                                </p>
                              )}
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="col-md-5 col-5 p-0">
                          <div className="d-flex">
                            <div className="d-flex mt-md-3 mt-0 inplay-board-team">
                              {entry.opponents.length > 1 && entry.opponents[1].asset != null && (
                                <img
                                  src={getAssetUrl(entry.opponents[1].asset)}
                                  className={this.state.rightIconNaturalWidth > 20 ? 'mr-2' : 'empty-img'}
                                  alt="img"
                                  ref={this.rightTeamIconRef}
                                  onLoad={this.handleRightImageLoaded}
                                />
                              )}
                              {entry.opponents.length > 1 && (
                                <p className="mt-md-2 mt-1 mb-md-4 mb-0">{entry.opponents[1].name}</p>
                              )}
                            </div>
                            {entry.opponents.length > 1 && (
                              <FavouriteIcon
                                eventId={entry.opponents[1].id}
                                isFav={this.props.favOpponents.includes(entry.opponents[1].id)}
                                clickFavIcon={this.props.toggleFavoriteOpponent}
                              />
                            )}
                            {entry.isLive ? (
                              <img
                                src={'/assets/image/market-view/Live@2x.svg'}
                                className="h-100 mt-m30 d-md-block d-none"
                                alt="img"
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row ml-0 mr-0 inplay-body-all d-flex ">
                      <div className="col-md-6 col-12 pl-md-0 pr-md-2 p-0">
                        {Object.keys(entry.marketGroups).map((market, index) =>
                          !(index % 2) ? (
                            <MarketGroup
                              eventId={entry.id}
                              group={entry.marketGroups[market]}
                              onlyDefaults={false}
                              key={index}
                            />
                          ) : (
                            ''
                          )
                        )}
                      </div>
                      <div className="col-md-6 col-12 pl-0 pr-0">
                        {Object.keys(entry.marketGroups).map((market, index) =>
                          index % 2 ? (
                            <MarketGroup
                              eventId={entry.id}
                              group={entry.marketGroups[market]}
                              onlyDefaults={false}
                              key={index}
                            />
                          ) : (
                            ''
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );

  }
}
const mapStateToProps = (state) => ({
  allSports: state.event.allSports,
  userInfo: selectUserInfo(state),
  favEvents: selectFavoriteEvents(state),
  favOpponents: selectFavoriteOpponents(state),
});

const mapDispatchToProps = {
  saveLiveGameData,
  toggleFavoriteEvent,
  fetchFavoriteEvents,
  fetchFavoriteOpponents,
  toggleFavoriteOpponent,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LiveTournament));
