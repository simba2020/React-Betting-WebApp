import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  setTournamentCollapse,
  collapseSportTournament,
  changeTournamentMarketGroup,
  changeTournamentMarketGroup2,
  addMarketGroup,
  clearTriggerTournament,
  saveQuickLinkData,
  saveFeaturedEvents,
  clearTournamentCollapse,
  fetchFavoriteEvents,
  toggleFavoriteEvent,
} from 'redux/actions';
import { selectFavoriteEvents, selectUserInfo } from 'redux/selectors/user';
import MarketGroup from 'components/sportsbook/marketGroup';
import QuickLink from 'components/quicklink';
import SportService from 'services/SportService';

import 'react-multi-carousel/lib/styles.css';
import MediaQuery from 'react-responsive';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Timer from 'components/timer';
import { JumpingDots } from 'components/jumping-dots';
import { getAssetUrl } from 'utils/EnvUtils';
import { EventPanel } from 'components/event-panel';
import { TournamentBlock } from 'components/tournament-block';
import { MarketGroupTab } from 'components/market-group-tab';

import ScrollContainer from 'react-indiana-drag-scroll';

class Sport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapse: this.props.collapse,
      tournaments_marketgroup: this.props.tournaments_marketgroup,
      tournaments_marketgroup2: this.props.tournaments_marketgroup2,
      loading: true,
      marketgroup: '',
      eventdata: '',
      showEventData: false,
      eventName: '',
      tournaments: null,
      loadingTournament: true,
      countryNum: 0, // TODO Remove
      region: new URLSearchParams(this.props.location.search).get('region'),
      featuredEvents: [],
      featuredMarketGroups: null,
      loadingFeatureEvents: true,
    };
  }

  componentDidMount() {
    const {
      userInfo: { isLoggedIn },
      match: {
        params: { sport },
      },
    } = this.props;

    this.setState({ eventdata: '' });
    this.props.clearTournamentCollapse();
    SportService.getSport(sport)
      .then((res) => {
        this.props.setTournamentCollapse(res.data.entries);
        this.setState({ tournaments: res.data, loading: false, loadingTournament: false });

        const selectedRegionName = this.state.region
          ? this.state.region
          : Object.keys(this.props.allSports.entries[sport].items).shift();

        const finalTournaments = this.state.tournaments.entries.filter(
          (item) => item.countryCanonicalName === selectedRegionName
        );

        const combinedGroups = Object.entries({
          ...finalTournaments[0].mgs.first,
          ...finalTournaments[0].mgs.second,
        })
          .slice(0, 5)
          .reduce((accu, [key, value]) => ({ ...accu, [key]: value }), {});

        this.changeTournamentMarketGroup(Object.keys(combinedGroups)[0], 0);

        if (isLoggedIn) {
          const ids = [];
          Object.keys(res.data.entries).forEach((key) => {
            if (res.data.entries[key].items !== null) {
              res.data.entries[key].items.forEach((item) => {
                if (item.items) {
                  item.items.forEach(({ id }) => {
                    ids.push(id);
                  });
                }
              });
            }
          });
          this.props.fetchFavoriteEvents(ids);
        }
      })
      .catch(() => {});

    SportService.getFeaturedEvents(sport)
      .then((res) => {
        this.props.saveFeaturedEvents(res.data.entries);
        this.setState({
          featuredMarketGroups: res.data.commonMarketGroups,
          featuredEvents: res.data.entries,
          loadingFeatureEvents: false,
        });
      })
      .catch(() => {});

    if (this.props.history.location.search === '?back=true') {
      this.setState({ showEventData: true });
    }
  }

  toggleTournament = (index, itemsPath) => {
    if (this.props.collapse_tournament[index]) {
      this.props.CollapseSportTournament(index);
      this.setState({});

      return;
    }

    SportService.getEvents(itemsPath)
      .then((res) => {
        const tournaments = this.state.tournaments;
        tournaments.entries[index].items = res.data.entries;
        tournaments.entries[index].commonMarketGroups = res.data.commonMarketGroups;

        this.setState({ tournaments });
        this.props.CollapseSportTournament(index);
        this.props.addMarketGroup([Object.keys(tournaments.entries[index].commonMarketGroups)[0], index]);
        this.setState({});

        const { isLoggedIn } = this.props.userInfo;
        if (isLoggedIn) {
          const ids = res.data.entries.reduce((accu, entry) => [...accu, entry.id], []);
          this.props.fetchFavoriteEvents(ids);
        }
      })
      .catch(() => {});
  };

  changeMarketGroup = (e) => {
    this.setState({ marketgroup: e });
  };

  changeTournamentMarketGroup = (param, id) => {
    this.props.changeTournamentMarketGroup([param, id]);
    this.setState({});
  };

  changeTournamentMarketGroup2 = (param, id) => {
    this.props.changeTournamentMarketGroup2([param, id]);
    this.setState({});
  };

  clickEvent = (id) => {
    const {
      history,
      match: {
        params: { sport },
      },
    } = this.props;

    history.push({
      pathname: '/event/' + id,
    });

    const payload = {
      quickLinkData: this.props.allSports.entries[sport],
      sportName: sport,
      countryNum: this.state.countryNum,
    };

    this.props.saveQuickLinkData(payload);
  };

  filterRegion = (region) => {
    this.props.history.push(`?region=${region}`);
    this.setState({ region });
  };

  displayEvents = (id, name) => {
    SportService.getEvents(id)
      .then((res) => {
        this.setState({
          eventdata: res.data,
          eventName: name,
          eventFlag: true,
          marketgroup: Object.keys(res.data.commonMarketGroups)[0],
        });
      })
      .catch(() => {});
  };

  renderFeaturedGame() {
    const featuredEvents = this.state.featuredEvents;
    const responsive = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 2.95,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1.35,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };

    if (featuredEvents.length === 0) {
      return null;
    }

    return (
      <div className="mr-0 mr-md-2 mb-2">
        <Carousel
          arrows={false}
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          transitionDuration={30000}
          customTransition="transform 2000ms ease-in-out"
        >
          {featuredEvents.map((entry, index) => (
            <div className="game-carousel-unit mr-md-2" style={{ position: 'relative' }} key={index}>
              <span className="tournament-name">{entry.tournamentName}</span>
              <div className="carousel-datetime">
                <Timer event={entry} inPlayIcon={true} />
              </div>
              <img alt="img" src={getAssetUrl('/interface/l-ic_favorite.svg')} className="img-favourite" />
              <div className="row text-center content-wrap">
                <div className="col-4 first-image-wrap p-md-2 p-2">
                  <img
                    loading="lazy"
                    src={getAssetUrl(entry.opponents[0].asset)}
                    className="carousel-player-img ml-5"
                    alt="player1"
                  />
                </div>
                <div className="team-name-wrap">
                  <div className="carousel-team-name mt-17">
                    <div>{entry.opponents[0].name}</div>
                    <div>{entry.opponents[1].name}</div>
                  </div>
                </div>
                <div className="col-8 third-image-wrap pl-0 p-md-2 p-2">
                  <img
                    loading="lazy"
                    src={getAssetUrl(entry.opponents[1].asset)}
                    className="carousel-player-img second-player-img mr-5"
                    alt="player2"
                  />
                </div>
              </div>
              <div className="row mr-0 ml-0 mt-2 carousel-odds">
                <MarketGroup
                  eventId={entry.id}
                  isPromotion={true}
                  group={entry.marketGroups}
                  onlyDefaults={true}
                  selected={Object.keys(entry.marketGroups)[0]}
                  key={Object.keys(entry.marketGroups)[0]}
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }

  render() {
    if (this.state.loading || this.state.loadingFeatureEvents || !this.props.allSports) {
      return <JumpingDots />;
    }

    const {
      match: {
        params: { sport },
      },
    } = this.props;

    const selectedRegionName = this.state.region
      ? this.state.region
      : Object.keys(this.props.allSports.entries[sport].items).shift();

    const finalTournaments = this.state.tournaments.entries.filter(
      (item) => item.countryCanonicalName === selectedRegionName
    );

    if (this.state.tournaments === null) {
      return null;
    }

    return (
      <div className="d-flex flex-column p-0 ml-0 mr-0 mt-md-3 mt-2">
        <div className={this.state.featuredEvents.length > 0 ? 'sport-main-container' : 'sport-main-container mt-160'}>
          <div className="pr-md-4 pr-lg-0">
            {this.props.allSports !== null ? (
              <div className="quick-links pr-md-2 pr-0">
                <MediaQuery minDeviceWidth={768}>
                  <QuickLink
                    data={this.props.allSports.entries[sport]}
                    selectedRegionName={selectedRegionName}
                    filterRegion={this.filterRegion}
                  />
                </MediaQuery>
                <MediaQuery maxDeviceWidth={600}>
                  {!this.state.showEventData && this.state.eventdata === '' && (
                    <QuickLink
                      data={this.props.allSports.entries[sport]}
                      selectedRegionName={selectedRegionName}
                      filterRegion={this.filterRegion}
                    />
                  )}
                </MediaQuery>
              </div>
            ) : null}

            {this.props.allSports !== null ? (
              <div className="desktop-middle-container pr-0 pr-md-2">
                {this.state.loadingTournament ? (
                  <JumpingDots />
                ) : (
                  <TournamentBlock
                    id={0}
                    marketgroup={this.props.tournaments_marketgroup}
                    changeMarketGroup={this.changeTournamentMarketGroup}
                    data={finalTournaments[0]}
                    allEntries={this.props.allSports.entries[sport]}
                    isOpen={this.props.collapse_tournament[0]}
                    onToggle={() => this.toggleTournament(0, finalTournaments[0].itemsPath)}
                  >
                    {finalTournaments.map((entry, index) => (
                      <div key={entry.canonicalName} className="block-content pl-md-4 pt-md-4 pl-2 pb-2 pt-2">
                        <div className="market-tap d-md-none d-flex">
                          <MarketGroupTab
                            id={index}
                            groups={Object.entries({
                              ...entry.mgs.first,
                              ...entry.mgs.second,
                            })
                              .slice(0, 5)
                              .reduce((accu, [key, value]) => ({ ...accu, [key]: value }), {})}
                            changeMarketGroup={this.changeTournamentMarketGroup}
                            marketgroup={this.props.tournaments_marketgroup}
                          />
                        </div>
                        <div className="header">
                          <div className="league-name ml-1 d-md-block d-none">{entry.displayName}</div>
                          <div className="league-name ml-1 mt-3 d-md-none d-block">{entry.displayName}</div>
                        </div>
                        <div className="position-relative mt-3">
                          <ScrollContainer>
                            <div className="flex sports-horizontal-events-wrap">
                              {entry.items !== null &&
                                entry.items.map((entry, eventIdx) => (
                                  <EventPanel
                                    entry={entry}
                                    isPromotion={false}
                                    isFav={this.props.eventFav.includes(entry.id)}
                                    toggleFavorite={this.props.toggleFavoriteEvent}
                                    selected={this.props.tournaments_marketgroup}
                                    key={eventIdx}
                                  />
                                ))}
                            </div>
                          </ScrollContainer>
                          {entry.items.length > 3 && <div className="shadow-effect"></div>}
                        </div>
                      </div>
                    ))}
                  </TournamentBlock>
                )}
              </div>
            ) : this.state.loadingTournament ? (
              <div className="desktop-middle-container pr-0 pr-md-2">
                <JumpingDots />
              </div>
            ) : (
              <div className="desktop-middle-container pr-0 pr-md-2" id="not-found-sport">
                <div className="not-found-page h-100">
                  <div>
                    <img src={'/assets/image/oops.svg'} alt="img" />
                    <p>Oops!</p>
                    <p>Something went wrong - Please try again</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  collapse: state.football.collapse,
  odd: state.football.odd,
  collapse_tournament: state.football.collapse_tournament,
  tournaments_marketgroup: state.football.tournaments_marketgroup,
  tournaments_marketgroup2: state.football.tournaments_marketgroup2,
  allSports: state.event.allSports,
  eventFav: selectFavoriteEvents(state),
  userInfo: selectUserInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  setTournamentCollapse: (payload) => dispatch(setTournamentCollapse(payload)),
  CollapseSportTournament: (payload) => dispatch(collapseSportTournament(payload)),
  changeTournamentMarketGroup: (payload) => dispatch(changeTournamentMarketGroup(payload)),
  changeTournamentMarketGroup2: (payload) => dispatch(changeTournamentMarketGroup2(payload)),
  addMarketGroup: (payload) => dispatch(addMarketGroup(payload)),
  clearTriggerTournament: () => dispatch(clearTriggerTournament()),
  saveQuickLinkData: (payload) => dispatch(saveQuickLinkData(payload)),
  saveFeaturedEvents: (payload) => dispatch(saveFeaturedEvents(payload)),
  fetchFavoriteEvents: (payload) => dispatch(fetchFavoriteEvents(payload)),
  toggleFavoriteEvent: (payload) => dispatch(toggleFavoriteEvent(payload)),
  clearTournamentCollapse: () => dispatch(clearTournamentCollapse()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sport));
