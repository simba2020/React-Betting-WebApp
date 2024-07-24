import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { clearTriggerTournament, fetchFavoriteEvents, toggleFavoriteEvent } from 'redux/actions';
import Tournament from 'components/tournament';
import { selectAllSports } from 'redux/selectors/event';
import { selectFavoriteEvents, selectUserInfo } from 'redux/selectors/user';
import SportService from 'services/SportService';
import QuickLink from 'components/quicklink';
import BlockMobileTournament from 'pages/sports/tournamentCollapse/blockMobileTournament';
import MediaQuery from 'react-responsive';
import { JumpingDots } from 'components/jumping-dots';

class TournamentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingTournament: true,
      tournament: '',
      marketgroup: '',
      marketgroup2: '',
      collapse: true,
      showEventData: false,
    };
  }

  componentDidMount() {
    const { isLoggedIn } = this.props.userInfo;

    SportService.getTournament(window.location.pathname.substr(7))
      .then((res) => {
        if (isLoggedIn) {
          const ids = res.data.entries.reduce((accu, { id }) => [...accu, id], []);
          this.props.fetchFavoriteEvents(ids);
        }

        this.setState({
          tournament: res.data,
          marketgroup: Object.keys(res.data.commonMarketGroups)[0],
          marketgroup2: Object.keys(res.data.commonMarketGroups)[1],
          loadingTournament: false,
        });
      })
      .catch(() => {});

    if (this.props.history.location.search === '?back=true') {
      this.setState({ showEventData: true });
    }
  }

  changeMarketGroup = (e) => {
    this.setState({ marketgroup: e });
  };

  changeMarketGroup2 = (e) => {
    this.setState({ marketgroup2: e });
  };

  clickEvent = (id) => {
    this.props.history.push({
      pathname: '/event/' + id,
    });
  };

  addEventFavourite = (id) => {
    this.props.toggleFavoriteEvent(id);
  };

  clearEventData = () => {
    this.props.clearTriggerTournament();
    this.setState({ tournament: '', showEventData: false });
  };

  render() {
    const { tournament } = this.state;
    const {
      allSports,
      match: {
        params: { sport: sportName },
      },
    } = this.props;

    if (allSports === null) {
      return null;
    }

    return (
      <div className="d-flex p-0 ml-0 mr-0 pt-112">
        <div className="sport-main-container">
          <div className="mobile-middle-container">
            {this.state.showEventData && tournament === '' && (
              <div className="d-md-none d-block">
                <JumpingDots />
              </div>
            )}
            {tournament !== '' && tournament.entries.length !== 0 && (
              <div className="d-md-none d-block">
                <BlockMobileTournament
                  isOpen={true}
                  data={tournament}
                  marketgroup={this.state.marketgroup}
                  sportName={allSports.entries[sportName].name}
                  eventName={tournament.entries[0].tournamentName}
                  marketGroup={this.changeMarketGroup}
                  clearEventData={this.clearEventData}
                  eventFav={this.props.favEvents}
                  iconPath={allSports.entries[sportName].asset.path}
                  clickEvent={this.clickEvent}
                  addEventFavourite={this.addEventFavourite}
                />
              </div>
            )}
          </div>

          <div className="d-flex pl-2 pl-md-0 pr-2 pr-md-0">
            <div className="quick-links pr-0">
              <MediaQuery minDeviceWidth={768}>
                <QuickLink
                  data={allSports.entries[sportName]}
                  displayEvents={this.displayEvents}
                  setCountryNum={this.setCountryNum}
                />
              </MediaQuery>
              <MediaQuery maxDeviceWidth={600}>
                {!this.state.showEventData && tournament === '' && (
                  <QuickLink
                    data={allSports.entries[sportName]}
                    displayEvents={this.displayEvents}
                    setCountryNum={this.setCountryNum}
                  />
                )}
              </MediaQuery>
            </div>
            <div className="desktop-middle-container pr-0">
              {tournament === '' ? (
                <JumpingDots />
              ) : tournament.entries.length !== 0 ? (
                <Tournament
                  data={tournament}
                  marketgroup={this.state.marketgroup}
                  marketgroup2={this.state.marketgroup2}
                  changeMarketGroup={this.changeMarketGroup}
                  changeMarketGroup2={this.changeMarketGroup2}
                  eventFav={this.props.favEvents}
                  clickEvent={this.clickEvent}
                  addEventFavourite={this.addEventFavourite}
                />
              ) : (
                <div className="desktop-middle-container p-0 w-100" id="not-found-sport">
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allSports: selectAllSports(state),
  favEvents: selectFavoriteEvents(state),
  userInfo: selectUserInfo(state),
});

const mapDispatchToProps = {
  clearTriggerTournament,
  toggleFavoriteEvent,
  fetchFavoriteEvents,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TournamentPage));
