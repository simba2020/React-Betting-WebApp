import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { AuthContent } from 'components/layout';
import { activate } from 'redux/reducers/auth';
import { selectIsActivating } from 'redux/selectors/auth';

const useStyles = makeStyles((theme) => ({
  plane: {
    width: '250px',
    height: 'auto',
  },
  verify: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

const Activate = () => {
  const classes = useStyles();
  const { token = null } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const isActivating = useSelector(selectIsActivating);

  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const redirect = (path) => {
      setTimeout(() => history.replace(path), 5000);
    };

    (async () => {
      const result = await dispatch(activate(token))
        .then(unwrapResult)
        .catch((e) => e);

      if (!result.success) {
        redirect('/');

        return;
      }

      setActivated(true);
      redirect('/login');
    })();
  }, [token, dispatch, history]);

  return (
    <AuthContent title="Account Activation">
      <Box flex={1} display="flex" flexDirection="column" alignItems="center">
        <img className={classes.plane} src="/assets/auth/paper-plane.svg" alt="Registration Success" />
        <Typography className={classes.verify} variant="h4" color="textSecondary">
          {isActivating && 'Please wait'}
          {!isActivating && activated && 'Account activated successfully'}
          {!isActivating && !activated && 'Account activation failed'}
        </Typography>
      </Box>
    </AuthContent>
  );
};

export default Activate;
