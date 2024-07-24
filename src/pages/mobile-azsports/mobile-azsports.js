import React from 'react';
import { useSelector } from 'react-redux';
import classes from './mobile-azsports.module.scss';
import { SportsItem } from 'components/sports-item';
import { selectAllSports } from 'redux/selectors/event';

export const MobileAZSports = (props) => {
  const allSports = useSelector(selectAllSports);
  if (!allSports) {
    return null;
  }

  const clickAzSport = (sport) => {
    props.history.push('/sport/' + sport);
  };

  const clickCasino = () => {
    props.history.push('/casino');
  };

  const lists = Object.keys(allSports.entries)
    .sort()
    .reduce((accu, key) => ({ ...accu, [key]: allSports.entries[key] }), {});

  return (
    <div className={`${classes.mobile_az_sport} px-2 pt-0`}>
      <div className="casino-wrap row">
        <div className="col-12 text-center align-items-center cursor" onClick={clickCasino}>
          <img src={'/assets/image/footer/Ic_Casino.svg'} alt="Casino" />
          <p className="mt-2">Casino</p>
        </div>
      </div>
      <div className={classes.custom_scroll}>
        {Object.values(lists).map((value, index) => (
          <div className="col-xl-3 col-md-6 col-12 row az-sport-unit px-0" key={index}>
            <div className="col-md-10 col-12 p-0">
              <SportsItem item={value} clickAzSport={clickAzSport} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
