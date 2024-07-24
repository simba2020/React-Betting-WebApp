import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleFavoriteEvent, fetchFavoriteEvents } from 'redux/actions';
import { selectFavoriteEvents, selectUserInfo } from 'redux/selectors/user';

import Block from './sportCollapse';
import BlockTournament from './sportCollapse/blockTournament';
import SportService from 'services/SportService';
import MobileEventList from 'components/mobile-event-list';
import 'react-toastify/dist/ReactToastify.css';
import { JumpingDots } from 'components/jumping-dots';
import { getAssetUrl } from 'utils/EnvUtils';
import {
  changeFMarketgroup,
  changeFMarketgroup2,
  changeMarketgroup,
  changeMarketgroup2,
  clearMarketgroup,
  closeFav,
  collapseBetpart,
  collapseFav,
  collapseTournament,
  setHomepageCollapse,
  openProfile,
} from 'redux/reducers/landing';
import { isOverflown } from 'components/media-queries';
import { EventPanel } from 'components/event-panel';
import { MarketGroupTab } from 'components/market-group-tab';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      arrow1: true,
      show: false,
      arrow2: true,
      show2: false,
      show_third_party_modal: false,
      isDragging: false,
    };
  }

  responsive = {
    superLargeDesktop: {
      breakpoint: { max: 5000, min: 4000 },
      items: 6,
    },
    normalLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    largeDesktop: {
      breakpoint: { max: 3000, min: 2300 },
      items: 4,
    },
    mediumDesktop: {
      breakpoint: { max: 2300, min: 2000 },
      items: 3.5,
    },
    smallDesktop: {
      breakpoint: { max: 2000, min: 1700 },
      items: 3.2,
    },
    desktop: {
      breakpoint: { max: 1700, min: 1368 },
      items: 2.8,
    },
    tablet: {
      breakpoint: { max: 1368, min: 1000 },
      items: 2.3,
    },
    smallTablet: {
      breakpoint: { max: 1000, min: 768 },
      items: 1.8,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  componentDidMount() {
    const { isLoggedIn } = this.props.userInfo;

    const goToProfile = window.location.pathname.substr(1);
    if (goToProfile) {
      this.dispatchProfileAction();
    }

    SportService.getHomepage()
      .then((res) => {
        this.props.setHomepageCollapse(res.data.entries);
        this.setState({ loading: false });
        Object.keys(this.props.data).forEach((key, index) => {
          const combinedGroups = Object.entries({
            ...this.props.data[key].mgs.first,
            ...this.props.data[key].mgs.second,
          })
            .slice(0, 5)
            .reduce((accu, [key, value]) => ({ ...accu, [key]: value }), {});

          const marketName = Object.keys(combinedGroups)[index];
          this.changeMarketGroup(marketName, index);
        });

        if (isLoggedIn) {
          const ids = [];

          Object.keys(res.data.entries).forEach((key) => {
            if (res.data.entries[key].items !== null) {
              res.data.entries[key].items.forEach((item) => {
                if (item.items) {
                  item.items.forEach(({ id }) => {
                    // TODO reduce
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
  }

  componentDidUpdate() {
    const { data } = this.props;
    if (!data) return;

    if (!this.state.overflowedStatuses) {
      const overflowedStatuses = Object.values(data).map((value) => [...value.items].fill(null));
      this.setState({ overflowedStatuses });
    }
  }

  dispatchProfileAction = () => {
    const navFlag = this.props.match.params.flag || 'profile';
    switch (navFlag) {
      case 'profile':
      case 'history':
      case 'transaction':
      case 'message':
      case 'payment':
        this.props.openProfile(navFlag);
        break;
      default:
        break;
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.marketgroup !== nextProps.marketgroup) {
      return {
        marketgroup: nextProps.marketgroup,
      };
    }

    return null;
  }

  toggleBetPart = (sport, id, isOpen) => {
    if (isOpen) {
      this.props.collapseBetpart(id);
      this.setState({});
    } else {
      this.props.clearMarketgroup();
      const sportName = sport;
      SportService.getSport(sportName)
        .then((res) => {
          const data = this.props.data;
          this.props.setHomepageCollapse({
            ...data,
            [sportName]: {
              ...data[sportName],
              items: res.data.entries,
              commonMarketGroups: res.data.commonMarketGroups,
            },
          });
          this.props.collapseBetpart(id);
        })
        .catch(() => {});
    }
  };

  toggleTournament = (info, sport_id, id, isOpen) => {
    if (isOpen) {
      this.props.collapseTournament([sport_id, id]);
    } else {
      const tournamentInfo = info;
      SportService.getEvents(tournamentInfo[1])
        .then((res) => {
          const data = this.props.data;
          this.setState({
            data: {
              ...data,
              [tournamentInfo[0]]: {
                ...data[tournamentInfo[0]],
                items: {
                  ...data[tournamentInfo[0]].items,
                  [tournamentInfo[2]]: { ...data[tournamentInfo[0]].items[tournamentInfo[2]], items: res.data.entries },
                },
              },
            },
          });
          this.props.collapseTournament([sport_id, id]);

          const ids = res.data.entries.reduce((accu, entry) => [...accu, entry.id], []);
          this.props.fetchFavoriteEvents(ids);
        })
        .catch(() => {});
    }
  };

  changeMarketGroup = (param, id) => {
    this.props.changeMarketgroup([param, id]);
  };

  changeMarketGroup2 = (param, id) => {
    this.props.changeMarketgroup2([param, id]);
  };

  clickEvent = (id) => {
    this.props.history.push({
      pathname: '/event/' + id,
    });
  };

  toggleFav = (id) => {
    this.props.collapseFav(id);
  };

  clickFMarket = () => {
    this.setState({
      arrow1: !this.state.arrow1,
      show1: !this.state.show1,
    });
  };

  clickFMarket2 = () => {
    this.setState({
      arrow2: !this.state.arrow2,
      show2: !this.state.show2,
    });
  };

  clickItem = (param) => {
    this.props.changeFMarketgroup(param);
  };

  clickItem2 = (param) => {
    this.clickFMarket2();
    this.props.changeFMarketGroup2(param);
  };

  carouselOverflown = (overflowRef, index, i) => {
    if (overflowRef) {
      const nativeElement = overflowRef.containerRef;
      if (nativeElement.current) {
        const { overflowedStatuses } = this.state;
        overflowedStatuses[index][i] = isOverflown(nativeElement.current);
      }
    }
  };

  onDragging = (dragging) => {
    this.setState({ isDragging: dragging });
  };

  render() {
    const { loading, isDragging, overflowedStatuses } = this.state;
    const { data, favData, allSports } = this.props;

    if (loading || !allSports) {
      return <JumpingDots />;
    }

    return (
      <div className="pr-md-4 pr-lg-0">
        <div className="row ml-0 mr-0">
          <div className="col-12 p-0" id="carousel_collapse">
            <div className="mt-md-4 mt-0">
              {this.props.flagFav ? (
                favData === null ? (
                  <JumpingDots />
                ) : (
                  <div className="block collapse-homepage mt-2 mb-1" id="favorite_div">
                    <div className="btn toggle row collapse-header">
                      <div className="col-6 text-left d-flex p-0 align-items-center">
                        <img src={getAssetUrl('/interface/star-selected.svg')} alt="Favorites" />
                        <p className="bet-sport-name ml-2">Favorite</p>
                      </div>
                      <div className="col-6 row d-flex p-0 m-0">
                        <div className="col-11 pr-0"></div>
                        <div className="col-1 p-0 text-right ml-auto">
                          <img
                            src={getAssetUrl('/interface/l-ic_close-1.svg')}
                            onClick={() => this.props.closeFav()}
                            alt="img"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="collapse-body pl-4 pt-1 pb-4 d-md-block d-none">
                      {favData !== null && favData.data.entries.length === 0 ? (
                        <div className="no-active-favorites">
                          <img
                            className="mx-auto mt-4"
                            src={getAssetUrl('/interface/fav-star-big.svg')}
                            alt="No Active Favorites"
                          />
                          <p className="mt-3">{favData.message}</p>
                        </div>
                      ) : (
                        favData.data.entries.map((item, i) => (
                          <BlockTournament data={item} isOpen={true} onToggle={() => this.toggleFav(i)} id={i} key={i}>
                            <Carousel
                              beforeChange={() => this.onDragging(true)}
                              afterChange={() => this.onDragging(false)}
                              arrows={false}
                              responsive={this.responsive}
                              infinite={false}
                              slidesToSlide={1}
                              autoPlay={false}
                            >
                              {item.items.length !== 0 &&
                                item.items.map((entry, eventIdx) => (
                                  <EventPanel
                                    entry={entry}
                                    isPromotion={false}
                                    isFav={this.props.favEvents.includes(entry.id)}
                                    toggleFavorite={this.props.toggleFavoriteEvent}
                                    key={eventIdx}
                                  />
                                ))}
                            </Carousel>
                          </BlockTournament>
                        ))
                      )}
                    </div>
                  </div>
                )
              ) : null}
              <div className="mt-0 d-md-block mb-md-0 event-list">
                {!!data &&
                  Object.keys(data).map((sport, index) => (
                    <Block
                      key={index}
                      id={index}
                      item={data[sport]}
                      isOpen={this.props.collapse[index].sport}
                      marketgroup={this.props.marketgroup}
                      changeMarketGroup={this.changeMarketGroup}
                      onToggle={() =>
                        this.toggleBetPart(data[sport].canonicalName, index, this.props.collapse[index].sport)
                      }
                    >
                      <div className="market-tap d-md-none d-flex p-md-0 pt-2 pl-2">
                        <MarketGroupTab
                          id={index}
                          groups={Object.entries({
                            ...data[sport].mgs.first,
                            ...data[sport].mgs.second,
                          })
                            .slice(0, 5)
                            .reduce((accu, [key, value]) => ({ ...accu, [key]: value }), {})}
                          marketgroup={this.props.marketgroup}
                          changeMarketGroup={this.changeMarketGroup}
                        />
                      </div>
                      <div className="collapse-body pl-md-4 pb-md-4 pt-md-4 pt-2 pl-2 pb-2">
                        {data[sport].items.map((item, i) => (
                          <div className="block-content" key={i}>
                            <div className="header">
                              <div className="league-name d-md-block d-none">{item.displayName}</div>
                              <div className="league-name mt-3 d-md-none d-block">{item.displayName}</div>
                            </div>
                            <div className="mt-md-3 mb-md-3 mt-2 mb-2 position-relative">
                              <Carousel
                                beforeChange={() => this.onDragging(true)}
                                afterChange={() => this.onDragging(false)}
                                arrows={false}
                                responsive={this.responsive}
                                infinite={false}
                                slidesToSlide={1}
                                autoPlay={false}
                                ref={(el) => this.carouselOverflown(el, index, i)}
                              >
                                {item.items.length !== 0 &&
                                  item.items.map((entry, eventIdx) => (
                                    <EventPanel
                                      entry={entry}
                                      isPromotion={false}
                                      isFav={this.props.favEvents.includes(entry.id)}
                                      toggleFavorite={this.props.toggleFavoriteEvent}
                                      selected={this.props.marketgroup[index]}
                                      key={eventIdx}
                                      isDragging={isDragging}
                                    />
                                  ))}
                              </Carousel>
                              {overflowedStatuses[index][i] && <div className="shadow-effect d-md-block d-none"></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="d-md-none d-none">
                        {data[sport].items.map((item, i) => (
                          <div key={i}>
                            {item.items.length !== 0 ? (
                              <MobileEventList
                                item={item}
                                key={i}
                                id={i}
                                eventFav={this.props.favEvents}
                                marketgroup={this.props.marketgroup}
                                marketGroup={this.changeMarketGroup}
                                clickEvent={this.clickEvent}
                                addEventFavourite={this.toggleFavEvent}
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </Block>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.landing.data,
  collapse: state.landing.collapse,
  marketgroup: state.landing.marketgroup,
  marketgroup2: state.landing.marketgroup2,
  flagFav: state.landing.flagFav,
  favData: state.landing.favData,
  fmarketgroup: state.landing.fmarketgroup,
  fmarketgroup2: state.landing.fmarketgroup2,
  profileFlag: state.landing.profileFlag,
  allSports: state.event.allSports,
  favEvents: selectFavoriteEvents(state),
  userInfo: selectUserInfo(state),
});

const mapDispatchToProps = {
  collapseBetpart,
  setHomepageCollapse,
  collapseTournament,
  changeMarketgroup,
  changeMarketgroup2,
  clearMarketgroup,
  collapseFav,
  closeFav,
  changeFMarketgroup,
  changeFMarketgroup2,
  openProfile,
  toggleFavoriteEvent,
  fetchFavoriteEvents,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Landing));
