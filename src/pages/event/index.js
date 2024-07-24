import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { triggerTournament, saveEvent, fetchFavoriteOpponents, toggleFavoriteOpponent } from 'redux/actions';

import MarketGroup from 'components/sportsbook/marketGroup';
import LinearInPlay from 'components/linear-inplay';
import { FavouriteIcon } from 'components/favourite-icon';
import { JumpingDots } from 'components/jumping-dots';
import Timer from 'components/timer';

import { selectFavoriteOpponents, selectUserInfo } from 'redux/selectors/user';
import SportService from 'services/SportService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFutbol } from '@fortawesome/free-solid-svg-icons';
import eventBus from 'services/eventBus';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAssetUrl } from 'utils/EnvUtils';

class Event extends Component {
  constructor(props) {
    super(props);
    this.eventSource = null;
    this.state = {
      loading: true,
      data: null,
      quickLinkData: this.props.quicklinkData.quickLinkData,
      countryNum: this.props.quicklinkData.countryNum,
      sportName: this.props.quicklinkData.sportName,
      marketgroup: '',
      leftIconNaturalWidth: 0,
      rightIconNaturalWidth: 0,
    };
    this.leftTeamIconRef = React.createRef();
    this.rightTeamIconRef = React.createRef();
  }

  componentDidMount() {
    const { isLoggedIn } = this.props.userInfo;
    const { id } = this.props.match.params;

    // TODO wolololo?
    eventBus.on('EVENT_' + id, (data) => {
      switch (data.type) {
        case 'eventend':
          this.finishEvent(data);
          break;
        default:
          break;
      }
    });

    SportService.getEvent(id)
      .then((res) => {
        this.props.saveEvent(res.data);
        // TODO wolololo?
        eventBus.dispatch('saveEvent', res.data.sportCanonicalName);

        if (isLoggedIn) {
          this.props.fetchFavoriteOpponents(res.data.opponents.map((o) => o.id));
        }

        this.setState({
          data: res.data,
          marketgroup: Object.keys(res.data.marketGroups)[0],
        });
      })
      .catch(() => {});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.allSports !== null && prevState.data !== null) {
      for (
        let i = 0;
        i < Object.keys(nextProps.allSports.entries[prevState.data.sportCanonicalName].items).length;
        i++
      ) {
        if (
          prevState.data.countryCanonicalName ===
          Object.keys(nextProps.allSports.entries[prevState.data.sportCanonicalName].items)[i]
        ) {
          return {
            quickLinkData: nextProps.allSports.entries[prevState.data.sportCanonicalName],
            countryNum: i,
            sportName: prevState.data.sportCanonicalName,
            loading: false,
          };
        }
      }
    }

    return null;
  }

  finishEvent(data) {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
    setTimeout(() => {
      this.timeout = setTimeout(() => {
        this.props.history.push('/');
      }, 3000);
    });
  }

  changeMarketGroup = (e) => {
    this.setState({ marketgroup: e });
  };

  clickEventHeader = () => {
    this.props.history.goBack();
  };

  handleLeftImageLoaded = () => {
    this.setState({ leftIconNaturalWidth: this.leftTeamIconRef.current.naturalWidth });
  };

  handleRightImageLoaded = () => {
    this.setState({ rightIconNaturalWidth: this.rightTeamIconRef.current.naturalWidth });
  };

  render() {
    const entry = this.state.data;

    return (
      <div>
        {entry !== null ? (
          <div className="d-flex ml-0 mr-md-2 mr-0 pt-112">
            <div className="event-data-wrap mt-md-4 mt-2">
              <div className="row ml-md-0">
                <div className="col-12 pl-md-1 pr-md-2">
                  <div id="inplay-header" className="p-2 d-flex mb-2" onClick={() => this.clickEventHeader()}>
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                    <FontAwesomeIcon icon={faFutbol} className="mr-2" />
                    <p className="mb-0">
                      <span className="d-md-inline d-none">{entry.isLive ? 'In play - ' : ''}</span>
                      {entry.sportName} - {entry.tournamentName}
                    </p>
                  </div>
                  <div id="inplay-board" className="p-md-3 p-1 mb-2">
                    <div className="row">
                      <div className="col-4">
                        {entry.isLive ? (
                          <img
                            src={'/assets/image/market-view/Live@2x.svg'}
                            className="float-left mt-1 d-md-none d-block"
                            alt="img-live"
                          />
                        ) : null}
                      </div>
                      <div className="col-4 text-center">
                        <Timer event={entry} livePage={entry.isLive} />
                      </div>
                      <div className="col-4">
                        {entry.hasCashout ? (
                          <img
                            src={getAssetUrl('/interface/l-ic_cashout.svg')}
                            className="float-right d-md-none d-block"
                            alt="img-cashout"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="row justify-content-end col-10">
                      {entry.isLive ? (
                        <img
                          src={'/assets/image/market-view/Live@2x.svg'}
                          className="h-100 mt-m30 d-md-block d-none"
                          alt="live-img"
                        />
                      ) : null}
                    </div>
                    <div className="row w-100 m-0 mb-md-3 p-0">
                      <div className="col-5 p-0 d-flex justify-content-end ml-auto">
                        <div className="d-flex align-items-center justify-content-center">
                          {entry.hasCashout ? (
                            <img
                              src={getAssetUrl('/interface/l-ic_cashout.svg')}
                              className="h-100 d-md-block d-none"
                              alt="img-cashout"
                            />
                          ) : null}

                          <FavouriteIcon
                            eventId={entry.opponents[0].id}
                            isFav={this.props.favOpponents.includes(entry.opponents[0].id)}
                            clickFavIcon={this.props.toggleFavoriteOpponent}
                          />
                          <div className="d-flex align-items-center mt-0 inplay-board-team ml-3">
                            <img
                              src={getAssetUrl(entry.opponents[0].asset)}
                              className={this.state.leftIconNaturalWidth > 20 ? 'ml-2 mr-4' : 'empty-img'}
                              alt="first-team-img"
                              ref={this.leftTeamIconRef}
                              onLoad={this.handleLeftImageLoaded}
                            />
                            <p className="mb-0 text-right">{entry.opponents[0].name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-1 p-0 d-flex align-items-center justify-content-center">
                        {entry.isLive ? (
                          <div id="inplay-board-score" className="text-center">
                            {entry.opponents.length > 1 && (
                              <p className="mb-0">
                                {entry.opponents[0].score} : {entry.opponents[1].score}
                              </p>
                            )}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="col-5 p-0 d-flex justify-content-start mr-auto">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="d-flex align-items-center mt-0 inplay-board-team mr-3">
                            {entry.opponents.length > 1 && <p className="mb-0 mr-4">{entry.opponents[1].name}</p>}
                            {entry.opponents.length > 1 && entry.opponents[1].asset != null && (
                              <img
                                src={getAssetUrl(entry.opponents[1].asset)}
                                className={this.state.rightIconNaturalWidth > 20 ? 'mr-2' : 'empty-img'}
                                alt="second-team-img"
                                ref={this.rightTeamIconRef}
                                onLoad={this.handleRightImageLoaded}
                              />
                            )}
                          </div>
                          {entry.opponents.length > 1 && (
                            <FavouriteIcon
                              eventId={entry.opponents[1].id}
                              isFav={this.props.favOpponents.includes(entry.opponents[1].id)}
                              clickFavIcon={this.props.toggleFavoriteOpponent}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {Object.keys(entry.stats).length > 0 && <LinearInPlay />}
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
              </div>
            </div>
          </div>
        ) : this.state.loading ? (
          <div className="d-flex ml-0 mr-md-2 mr-0 pt-112">
            <div className="event-data-wrap">
              <div className="row ml-md-0">
                <div className="col-md-80 col-12 pl-md-2">
                  <JumpingDots />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex ml-0 mr-md-2 mr-0 pt-112">
            <div style={{ width: '80%' }}>
              <div className="not-found-page h-100">
                <div>
                  <img src={window.location.origin + '/assets/image/oops.svg'} alt="img" />
                  <p>Oops!</p>
                  <p>Something went wrong - Please try again</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allSports: state.event.allSports,
  quicklinkData: state.football.quicklinkData,
  favOpponents: selectFavoriteOpponents(state),
  userInfo: selectUserInfo(state),
});

const mapDispatchToProps = {
  triggerTournament,
  saveEvent,
  fetchFavoriteOpponents,
  toggleFavoriteOpponent,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Event));
