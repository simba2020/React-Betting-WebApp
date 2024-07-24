import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { DebounceInput } from 'react-debounce-input';

import { fetchFavoriteEvents, toggleFavoriteEvent } from 'redux/reducers/user';
import { selectFavoriteEvents, selectUserInfo } from 'redux/selectors/user';
import ApiService from 'services/ApiService';

import SportService from 'services/SportService';

import MarketGroup from 'components/sportsbook/marketGroup';
import TournamentView from 'components/tournament-view';
import Timer from 'components/timer';

import { getAssetUrl } from 'utils/EnvUtils';
import { JumpingDots } from 'components/jumping-dots';

import 'react-toastify/dist/ReactToastify.css';

const QUERY_MIN_LENGTH = 3;

const Search = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search: searchParams } = useLocation();

  const favEvents = useSelector(selectFavoriteEvents);
  const { isLoggedIn } = useSelector(selectUserInfo);

  const [value, setValue] = useState('');
  const [data, setData] = useState(null);
  const cancelTokenSource = useRef(ApiService.getCancelTokenSource());

  useEffect(() => {
    return () => {
      cancelTokenSource.current.cancel();
    };
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(searchParams);

    if (!query.has('q')) {
      setValue('');

      return;
    }

    setValue(query.get('q'));
  }, [searchParams]);

  useEffect(() => {
    if (!value) {
      return;
    }

    history.push({ search: `q=${value}` });

    cancelTokenSource.current.cancel();
    cancelTokenSource.current = ApiService.getCancelTokenSource();

    setData(null);

    SportService.search(value, { cancelToken: cancelTokenSource.current.token })
      .then((res) => {
        setData(res.data);

        if (isLoggedIn) {
          const ids = [];

          for (let i = 0; i < res.data.entries.length; i++) {
            if (res.data.entries[i].items !== null) {
              for (let j = 0; j < res.data.entries[i].items.length; j++) {
                ids.push(res.data.entries[i].items[j].id);
              }
            }
          }

          dispatch(fetchFavoriteEvents(ids));
        }
      })
      .catch(() => {});
  }, [value, dispatch, history, isLoggedIn]);

  const valueChange = (val) => {
    if (typeof val !== 'string' || !val.length) {
      setData(null);
      setValue('');
      history.push('/search');

      return;
    }

    if (val.length < QUERY_MIN_LENGTH) {
      return;
    }

    setValue(val);
  };

  const clickEvent = (id) => {
    history.push({
      pathname: '/event/' + id,
    });
  };

  const addEventFavourite = (id) => {
    dispatch(toggleFavoriteEvent(id));
  };

  const renderResult = (data) => {
    if (data.status === 404 || data[0].total === 0) {
      return (
        <div className="no-search-result flex flex-column align-items-center justify-content-center">
          <img src={getAssetUrl('/interface/binoculars.svg')} alt="img" />
          <p>No result found please search for something else</p>
        </div>
      );
    }
      const results = data[0].items;

      return (
        <div className="collapse-body pl-2 pr-2">
          <div className="p-2 search-result">
            <p>Search Results:</p>&nbsp;
            <p>{value}</p>&nbsp;
            <p>
              (showing {results.length} of {data[0].total} results)
            </p>
          </div>
          <div className="d-md-block d-none">
            {results.map((entry, i) => (
              <div className="collapse-body-game row football-collapse d-md-flex d-none" key={i} id={entry.id}>
                <div
                  className="col-md-5 col-12 d-flex p-0"
                  onClick={() =>
                    history.push({
                      pathname: '/event/' + entry.id,
                    })
                  }
                >
                  <div className="col-md-3 col-5">
                    <Timer event={entry} direction={false} />
                  </div>
                  <div className="col-md-9 col-7 p-0">
                    {entry.opponents.length === 1 ? (
                      <div className="d-flex set-center">
                        <img src={getAssetUrl(entry.opponents[0].asset)} className="team-icon mr-2" alt="img" />
                        <p className="opponent-name pt-0">{entry.opponents[0].name}</p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="d-flex">
                          <img src={getAssetUrl(entry.opponents[0].asset)} className="team-icon mr-2" alt="img" />
                          <p className="opponent-name pt-0">{entry.opponents[0].name}</p>
                        </div>
                        <div className="d-flex mt-1">
                          <img src={getAssetUrl(entry.opponents[1].asset)} className="team-icon mr-2" alt="img" />
                          <p className="opponent-name pt-0">{entry.opponents[1].name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="col-md-3 col-12 row p-0 m-0"
                  onClick={() =>
                    history.push({
                      pathname: '/event/' + entry.id,
                    })
                  }
                >
                  {entry.opponents.length === 1 ? (
                    <div className="col-3 p-0">
                      <p className="yellow-score set-center">{entry.isLive ? entry.opponents[0].score : null}</p>
                    </div>
                  ) : (
                    <div className="col-3 mt-3 p-0">
                      <p className="yellow-score pl-md-0 pl-5">{entry.isLive ? entry.opponents[0].score : null}</p>
                      <p className="yellow-score mt-1 pl-md-0 pl-5">{entry.isLive ? entry.opponents[1].score : null}</p>
                    </div>
                  )}
                  <div className="col-2 mt-4 p-0">
                    {entry.hasCashout ? <img alt="cashout-img" id="cashout-img" /> : null}
                  </div>
                  <div className="col-3 mt-4 pl-0 pr-1">
                    {entry.isLive ? (
                      <img alt="live-img" id="live-img" src={getAssetUrl('/interface/Live@2x.svg')} />
                    ) : null}
                  </div>
                  <div className="col-2 mt-4 p-0">
                    {entry.hasStats ? (
                      <img alt="stat-img" id="stat-img" src={getAssetUrl('/interface/l-ic_statistics.svg')} />
                    ) : null}
                  </div>
                  <div className="col-2 mt-4 pl-0">
                    <img
                      alt="live-center-img"
                      id="live-center-img"
                      src={getAssetUrl('/interface/l-ic_live_center.svg')}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-12 row m-0 p-0">
                  <div
                    className="col-9 ml-md-0 ml-1 row p-0"
                    onClick={() =>
                      history.push({
                        pathname: '/event/' + entry.id,
                      })
                    }
                  >
                    <MarketGroup
                      eventId={entry.id}
                      group={entry.marketGroups}
                      onlyDefaults={true}
                      selected={Object.keys(entry.marketGroups)[0]}
                      key={Object.keys(entry.marketGroups)[0]}
                    />
                  </div>
                  <div className="col-3 row p-0 ml-3 align-items-center">
                    <div className="total-score col-8 p-0 mt-011">
                      <p
                        className="market-count"
                        onClick={() =>
                          history.push({
                            pathname: '/event/' + entry.id,
                          })
                        }
                      >
                        +{Object.keys(entry.marketGroups).length}...
                      </p>
                    </div>
                    <div className="search-fav-column p-0 col-4 flex justify-content-center">
                      <img
                        alt="Event in favourite list"
                        onClick={() => dispatch(toggleFavoriteEvent(entry.id))}
                        src={
                          favEvents.includes(entry.id)
                            ? getAssetUrl('/interface/star-selected.svg')
                            : getAssetUrl('/interface/l-ic_favorite.svg')
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-md-none d-block">
            {results.map((entry, i) => (
              <TournamentView
                key={i}
                marketgroup={Object.keys(entry.marketGroups)[0]}
                eventFav={favEvents}
                entry={entry}
                clickEvent={clickEvent}
                addEventFavourite={addEventFavourite}
              />
            ))}
          </div>
        </div>
      );

  };

  return (
    <>
      <div className="search-div mr-xl-2 mr-md-3 mr-0">
        <div>
          <img src={getAssetUrl('/interface/l-ic_serach.svg')} className="mr-4 ml-4" alt="img" />
          <DebounceInput
            placeholder="Search"
            debounceTimeout={500}
            value={value}
            onChange={(e) => valueChange(e.target.value)}
          />
        </div>
      </div>
      <div className="d-flex p-2 ml-0 mr-0 search-content-wrap">
        <div className="sport-main-container">
          {data === null && value !== '' ? <JumpingDots /> : data !== null ? renderResult(data) : null}
        </div>
      </div>
    </>
  );
};

export default Search;
