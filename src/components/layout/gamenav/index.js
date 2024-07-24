import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { closeQuickLink, saveAllSports, clearTriggerTournament } from 'redux/actions';
import AZSports from 'components/azsports';
import SportService from 'services/SportService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSearch } from '@fortawesome/free-solid-svg-icons';
import eventBus from 'services/eventBus';
import { getAssetUrl } from 'utils/EnvUtils';

import { SmallDesktop, MediumDesktop, LargeDesktop, Tablet } from 'components/media-queries';

class GameNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      azhover: false,
      loading: true,
      data: null,
      topLists: null,
      activeNav: null,
      width: window.innerWidth,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    const {
      params: { sport },
    } = this.props.match;

    this.unlisten = this.props.history.listen((location) => {
      let endpoint = '';
      if (location.pathname.includes('/sport')) {
        endpoint = location.pathname.split('/')[2];
      }

      if (location.pathname.includes('/live')) {
        endpoint = 'live';
      }

      if (location.pathname.includes('/coupon')) {
        endpoint = 'coupon';
      }

      if (location.pathname.includes('/search')) {
        endpoint = 'search';
      }

      this.activeNavigationBar(endpoint);
    });
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    SportService.getAllSports()
      .then((res) => {
        this.props.saveAllSports(res.data);
        const topLists = ['live', 'coupon', 'search'];
        for (let i = 0; i < res.data.top.length; i++) {
          topLists.push(res.data.top[i].canonicalName);
        }

        const activeNav = topLists.reduce((accu, item) => ({ ...accu, [item]: item === sport }), {});

        if (activeNav.coupon) {
          Object.keys(activeNav).forEach((key) => {
            activeNav[key] = false;
          });
          activeNav.coupon = true;
        }

        this.setState({ data: res.data, topLists, activeNav });
        if (window.location.pathname.includes('/event')) {
          const event = this.props.event;
          this.setState((prevState) => {
            const activeNav = { ...prevState.activeNav };
            if (event?.sportCanonicalName) activeNav[event.sportCanonicalName] = true;

            return { activeNav };
          });
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {});

    eventBus.on('saveEvent', (data) => {
      this.activeNavigationBar(data);
    });
  }

  activeNavigationBar = (endpoint) => {
    const activeNav = this.state.activeNav;
    if (activeNav !== null) {
      Object.keys(activeNav).forEach(function (key) {
        if (endpoint === key) {
          activeNav[key] = true;
        } else {
          activeNav[key] = false;
        }
      });
      this.setState({ activeNav });
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  clickAZ = () => {
    this.setState({ azhover: !this.state.azhover });
  };

  changeHoverFlag = (e) => {
    if (e === undefined) {
      this.setState({ azhover: false });
    } else if (e.srcElement.innerText === 'A-Z Sports' || e.srcElement.innerText === undefined) {
    } else {
      this.setState({ azhover: false });
    }
  };

  clickGameNav = (sport) => {
    localStorage.removeItem('offsetTop');
    this.props.closeQuickLink();
    this.props.clearTriggerTournament();

    if (sport === 'horseracing') {
      this.props.history.push('/' + sport);
    } else {
      this.props.history.push('/sport/' + sport);
    }
    const activeNav = this.state.activeNav;
    Object.keys(activeNav).forEach(function (key) {
      if (sport === key) {
        activeNav[key] = true;
      } else {
        activeNav[key] = false;
      }
    });
    this.setState({ activeNav });
  };

  render() {
    const screenWidth = this.state.width;

    const classes = screenWidth > 768 && screenWidth < 1200 ? 'col-2 game-nav-unit' : 'game-nav-unit';
    const activeNavClasses = `${classes} game-nav-active d-md-inline-block d-none`;
    const navClasses = `${classes} d-md-inline-block d-none`;
    const activeSportClasses = `${classes} game-nav-active`;

    if (this.state.loading) {
      return null;
    }

    const sportsList = this.state.data.top;
    const renderGameNavigationItems = (sportsList) => {
      return sportsList.map((top, index) => (
        <div
          className={this.state.activeNav[top.canonicalName] ? activeSportClasses : classes}
          id={'game-nav-' + top.canonicalName}
          key={index}
          onClick={() => this.clickGameNav(top.canonicalName)}
        >
          <img src={getAssetUrl(top.asset.path)} alt="img" />
          <p>{top.name}</p>
        </div>
      ));
    };

    return (
      <div id="game-nav-bar">
        <div className="d-md-flex d-none mt-1 mr-0 ml-0 game-nav-wrap">
          <div className="sports-nav d-flex justify-content-between">
            <div className="game-nav-unit d-md-inline-block d-none" id="game-nav-az" onClick={this.clickAZ}>
              <FontAwesomeIcon icon={faEllipsisH} className={this.state.azhover ? 'game-nav-unit-active' : ''} />
              <p className={this.state.azhover ? 'game-nav-unit-active' : ''}>A-Z Sports</p>
            </div>
            <Link to="/live">
              <div className={this.state.activeNav['live'] ? activeNavClasses : navClasses} id="game-nav-live">
                <img src={getAssetUrl('/interface/live.svg')} alt="img-live" />
                <p>In Play</p>
              </div>
            </Link>
            <Link to="/coupon">
              <div className={this.state.activeNav['coupon'] ? activeNavClasses : navClasses} id="game-nav-coupon">
                <img src={getAssetUrl('/interface/Ic_coupon_Grey.svg')} alt="img-coupon" />
                <p>Coupons</p>
              </div>
            </Link>
            <Tablet>{renderGameNavigationItems(sportsList.slice(0, 3))}</Tablet>
            <SmallDesktop>{renderGameNavigationItems(sportsList.slice(0, sportsList.length - 2))}</SmallDesktop>
            <MediumDesktop>{renderGameNavigationItems(sportsList.slice(0, sportsList.length - 2))}</MediumDesktop>
            <LargeDesktop>{renderGameNavigationItems(sportsList)}</LargeDesktop>
          </div>
          <Link to="/search">
            <div className={this.state.activeNav['search'] ? activeNavClasses : navClasses}>
              <FontAwesomeIcon
                icon={faSearch}
                className={this.state.activeNav['search'] ? 'game-nav-svg-active mt-3' : 'mt-3'}
              />
            </div>
          </Link>
        </div>

        <div className="d-md-none d-flex mt-1 mr-0 ml-0 game-nav-wrap">
          <Link to="/coupon">
            <div
              className={this.state.activeNav['coupon'] ? 'game-nav-unit game-nav-active' : 'game-nav-unit'}
              id="game-nav-coupon"
            >
              <img src={getAssetUrl('/interface/Ic_coupon_Grey.svg')} alt="img-coupon" />
              <p>Coupons</p>
            </div>
          </Link>
          {sportsList.map((top, index) => (
            <div
              className={this.state.activeNav[top.canonicalName] ? 'game-nav-unit game-nav-active' : 'game-nav-unit'}
              id={'game-nav-' + top.canonicalName}
              key={index}
              onClick={() => this.clickGameNav(top.canonicalName)}
            >
              <img src={getAssetUrl(top.asset.path)} alt="img" />
              <p>{top.name}</p>
            </div>
          ))}
        </div>
        <AZSports
          hoverFlag={this.state.azhover}
          lists={this.state.data.entries}
          mobileType={false}
          changeHoverFlag={this.changeHoverFlag}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  event: state.event.event,
});

const mapDispatchToProps = (dispatch) => ({
  closeQuickLink: () => dispatch(closeQuickLink()),
  saveAllSports: (payload) => dispatch(saveAllSports(payload)),
  clearTriggerTournament: () => dispatch(clearTriggerTournament()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameNav));
