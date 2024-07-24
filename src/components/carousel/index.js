import React, { useState, useEffect } from 'react';

import { EventPanel } from 'components/event-panel';
import SportService from 'services/SportService';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { toggleFavoriteEvent } from 'redux/reducers/user';
import { selectFavoriteEvents } from 'redux/selectors/user';

import 'react-multi-carousel/lib/styles.css';

const CarouselComponent = (props) => {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [featuredEvents, setFeaturedEvents] = useState(null);

  useEffect(() => {
    SportService.getPromotionContents()
      .then((res) => {
        setData(res.data);
        window.scrollTo(0, 0);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (props.featuredEvents) {
      setFeaturedEvents(props.featuredEvents);
    }
  }, [props.featuredEvents]);

  const toggleFavEvent = (id) => {
    dispatch(toggleFavoriteEvent(id));
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 5000, min: 4000 },
      items: 7,
    },
    normalLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    largeDesktop: {
      breakpoint: { max: 3000, min: 2300 },
      items: 5,
    },
    smallDesktop: {
      breakpoint: { max: 2300, min: 1500 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1500, min: 1368 },
      items: 3.5,
    },
    tablet: {
      breakpoint: { max: 1368, min: 1000 },
      items: 3,
    },
    smallTablet: {
      breakpoint: { max: 1000, min: 768 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  let list = featuredEvents;
  if (window.location.pathname === '/') {
    list = data;
  }

  if (list === null || list.length === 0) {
    return null;
  }

  return (
    <div className="landing-carousel position-relative pt-112 pl-md-3 pl-2 pt-2 pt-md-4 pb-md-0">
      <Carousel
        arrows={false}
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        autoPlaySpeed={15000}
        transitionDuration={30000}
        customTransition="transform 2000ms ease-in-out"
      >
        {list.map((entry, index) => (
          <EventPanel
            entry={entry}
            isPromotion={true}
            isFav={props.favEvents.includes(entry.id)}
            toggleFavorite={toggleFavEvent}
            selected={Object.keys(entry.marketGroups)[0]}
            key={index}
          />
        ))}
      </Carousel>
      <div className="shadow-effect d-md-block d-none mt-2 mt-md-4"></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  featuredEvents: state.football.featuredEvents,
  favEvents: selectFavoriteEvents(state),
});

export default withRouter(connect(mapStateToProps, null)(CarouselComponent));
