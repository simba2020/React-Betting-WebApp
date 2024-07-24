import React from 'react';
import { getAssetUrl } from 'utils/EnvUtils';
import { useSelector } from 'react-redux';
import { selectUserInfo } from 'redux/selectors/user';
import { toast } from 'react-toastify';
import classes from './favourite-icon.module.scss';

const FavouriteIcon = (props) => {
  const { isFav, eventId, clickFavIcon } = props;
  const { isLoggedIn } = useSelector(selectUserInfo);

  const onClickFavIcon = () => {
    if (isLoggedIn) {
      clickFavIcon(eventId);
    } else {
      toast.error('You must be signed in to use this feature');
    }
  };

  return (
    <div className={classes.event_favourite}  onClick={() => onClickFavIcon()}>
      <img
        alt={isFav ? 'Favourite selected' : 'Favourite unselected'}
        src={isFav ? getAssetUrl('/interface/star-selected.svg') : getAssetUrl('/interface/l-ic_favorite.svg')}
      />
    </div>
  );
};

export { FavouriteIcon };
