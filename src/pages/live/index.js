import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getLiveNav,
  fetchEvent,
  saveLiveGameData,
  setLoading,
  fetchFavoriteOpponents,
  toggleFavoriteOpponent,
  toggleFavoriteEvent,
  fetchFavoriteEvents,
  changeLiveMarketGroup,
  clearCollapseLive,
  setCollapseLive,
  addMarketGroup,
  collapseLive,
} from 'redux/actions';
import SportService from 'services/SportService';
import { JumpingDots } from 'components/jumping-dots';
import 'react-toastify/dist/ReactToastify.css';
import { selectIsLoading, selectLiveGameData, selectLiveNav } from 'redux/selectors/live';
import { selectFavoriteEvents, selectFavoriteOpponents, selectUserInfo } from 'redux/selectors/user';
import ToggleButtonScroll from 'components/toggle-button-scroll';
import { TournamentBlock } from 'components/tournament-block';
import { EventPanel } from 'components/event-panel';
import ScrollContainer from 'react-indiana-drag-scroll';

const sortByKey = (a, b, key) => {
  if (a[key] > b[key]) {
    return 1;
  }
  if (a[key] < b[key]) {
    return -1;
  }

  return 0;
};

const Live = (props) => {
  const { allSports, liveNav, getLiveNav, setCollapseLive } = props;

  const [countries, setCountries] = useState(null);
  const [sports, setSports] = useState(null);
  const [allTournaments, setAllTournaments] = useState(null);
  const [tournaments, setTournaments] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const getCountries = useCallback(
    (tournament) => {
      return Object.entries(allSports.entries[selectedSport].items)
        .filter(([_, country]) => Object.keys(tournament.entries).includes(country.name))
        .map(([_, country]) => ({
          id: country.name,
          name: country.name,
          asset: country.flag,
          selected: false,
          count: tournament.entries[country.name].reduce((accu, cur) => accu + (cur.itemsCount || 0), 0),
        }))
        .sort((a, b) => sortByKey(a, b, 'id'));
    },
    [allSports, selectedSport]
  );

  const formatFilterData = useCallback(() => {
    const sports = liveNav
      .map((nav) => ({
        name: nav.name,
        id: nav.id,
        asset: allSports?.entries[nav.id]?.asset,
        selected: false,
      }))
      .filter((sport) => Object.keys(allSports?.entries).includes(sport.id))
      .sort((a, b) => sortByKey(a, b, 'id'));

    if (Array.isArray(sports) && sports.length) {
      sports[0].selected = true;

      setSports(sports);
      setSelectedSport(sports[0].id);
    }
  }, [allSports, liveNav]);

  const filterSports = useCallback(
    (sport) => {
      if (sport !== selectedSport) {
        const updatedSports = sports.map((item) => ({
          ...item,
          selected: item.id === sport,
        }));

        setSports(updatedSports);
        setSelectedSport(sport);
        setCountries([]);
      }
    },
    [selectedSport, sports]
  );

  const filterCountries = useCallback(
    (country, selected) => {
      const updatedCountries = countries.map((c) => {
        if (c.id === country) {
          return {
            ...c,
            selected,
          };
        }

        return {
          ...c,
          selected: false,
        };
      });

      const selectedCountry = updatedCountries.find((c) => c.selected);

      if (selectedCountry) {
        setTournaments({
          ...allTournaments,
          entries: {
            [country]: [...allTournaments.entries[country]],
          },
        });
        setCountries(updatedCountries);
      } else {
        setTournaments(allTournaments);
        setCountries(updatedCountries);
      }
    },
    [allTournaments, countries]
  );

  useEffect(() => {
    getLiveNav();
  }, [getLiveNav]);

  useEffect(() => {
    if (allSports && liveNav?.length) {
      formatFilterData();
    }
  }, [allSports, liveNav, formatFilterData]);

  useEffect(() => {
    if (!selectedSport) {
      return;
    }

    const live = liveNav.find((nav) => nav.id === selectedSport);

    setDataLoading(true);

    SportService.getSport(selectedSport).then((res) => {
      const entries = res.data.entries
        .filter((entry) => Object.keys(live.items).includes(entry.canonicalName))
        .map((entry) => {
          const items = entry.items.filter((item) => item.isLive);

          return {
            ...entry,
            items,
            itemsCount: items.length,
          };
        })
        .sort((a, b) => sortByKey(a, b, 'countryCanonicalName'))
        .reduce((accu, obj) => {
          return Object.assign(accu, { [obj.countryName]: (accu[obj.countryCanonicalName] || []).concat(obj) });
        }, {});

      const data = {
        ...res.data,
        entries,
      };

      setCollapseLive(entries);
      setTournaments(data);
      setAllTournaments(data);
      setCountries(getCountries(data));
      setDataLoading(false);
    });
  }, [selectedSport, liveNav, setCollapseLive, getCountries]);

  const changeLiveMarketGroup = (param, id) => {
    props.changeLiveMarketGroup([param, id]);
  };

  const toggleLive = (index, country) => {
    if (props.collapse_live[index]) {
      props.collapseLive(index);

      return;
    }

    const requests = tournaments.entries[country].map((entry) => SportService.getEvents(entry.itemsPath));
    const updatedTournaments = { ...tournaments };

    Promise.all(requests).then((responses) => {
      responses.forEach((response, index) => {
        updatedTournaments.entries[country][index].items = response.data.entries.filter((entry) => entry.isLive);
        updatedTournaments.entries[country][index].commonMarketGroups = response.data.commonMarketGroups;
        const { isLoggedIn } = props.userInfo;
        if (isLoggedIn) {
          const ids = response.data.entries.map((entry) => entry.id);
          props.fetchFavoriteEvents(ids);
        }
      });

      setTournaments(updatedTournaments);
      props.collapseLive(index);
      props.addMarketGroup([Object.keys(updatedTournaments.entries[country][0].commonMarketGroups)[0], index]);
    });
  };

  if (props.loading) {
    return <JumpingDots />;
  }

  return (
    <div>
      <div className="row d-flex ml-0 mr-0 pt-112">
        <div className="col-12 p-3 mt-4 filter-container">
          {sports?.length > 0 && (
            <div>
              <p className="live-filter-title">Sports</p>
              <ToggleButtonScroll data={sports} onSelect={filterSports} />
            </div>
          )}
          {countries?.length > 0 && (
            <div className="mt-4">
              <p className="live-filter-title">Countries</p>
              <ToggleButtonScroll data={countries} onSelect={filterCountries} />
            </div>
          )}
        </div>
        <div className="w-100">
          {dataLoading ? (
            <JumpingDots />
          ) : (
            tournaments?.entries &&
            Object.keys(tournaments?.entries).map((key, index) => (
              <TournamentBlock
                key={index}
                id={index}
                marketgroup={props.liveMarketgroup[index]}
                changeMarketGroup={changeLiveMarketGroup}
                data={tournaments.entries[key][0]}
                allEntries={props.allSports.entries[selectedSport]}
                isOpen={props.collapse_live[index]}
                onToggle={() => toggleLive(index, key)}
              >
                {tournaments.entries[key].map((entry, index) => (
                  <div className="block-content pl-md-4 pt-md-4 pl-2 pb-2 pt-2" key={index}>
                    <div className="header">
                      <div className="league-name ml-1 d-md-block d-none">{entry.displayName}</div>
                      <div className="league-name ml-1 mt-3 d-md-none d-block">{entry.displayName}</div>
                    </div>
                    <div className="position-relative mt-3">
                      <ScrollContainer>
                        <div className="flex sports-horizontal-events-wrap">
                          {entry.items !== null &&
                            entry.items.map((entry, index) => (
                              <EventPanel
                                entry={entry}
                                isPromotion={false}
                                isFav={props.favEvents.includes(entry.id)}
                                toggleFavorite={props.toggleFavoriteEvent}
                                selected={props.liveMarketgroup[index]}
                                key={index}
                              />
                            ))}
                        </div>
                      </ScrollContainer>
                      {entry.items.length > 3 && <div className="shadow-effect"></div>}
                    </div>
                  </div>
                ))}
              </TournamentBlock>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  loading: selectIsLoading(state),
  liveNav: selectLiveNav(state),
  liveGameData: selectLiveGameData(state),
  favoriteOpponents: selectFavoriteOpponents(state),
  allSports: state.event.allSports,
  userInfo: selectUserInfo(state),
  favEvents: selectFavoriteEvents(state),
  collapse_live: state.live.collapse_live,
  liveMarketgroup: state.live.liveMarketgroup,
});

const mapDispatchToProps = {
  setLoading,
  saveLiveGameData,
  getLiveNav,
  fetchEvent,
  fetchFavoriteOpponents,
  toggleFavoriteOpponent,
  toggleFavoriteEvent,
  fetchFavoriteEvents,
  changeLiveMarketGroup,
  clearCollapseLive,
  setCollapseLive,
  addMarketGroup,
  collapseLive,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Live));
