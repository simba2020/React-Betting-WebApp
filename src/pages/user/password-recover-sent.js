import { AuthContent } from 'components/layout';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  plane: {
    width: '250px',
    height: 'auto',
    marginBottom: theme.spacing(5),
  },
}));

const PasswordRecoverSent = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useLocation();

  if (!state || !state.message) {
    history.replace('/');

    return null;
  }

  return (
    <AuthContent title="Password Recovery Success">
      <Box flex={1} display="flex" flexDirection="column" alignItems="center">
        <img className={classes.plane} src="/assets/auth/paper-plane.svg" alt="Password Recovery Success" />
        <Typography color="textSecondary" align="center">
          {state.message}
        </Typography>
      </Box>
    </AuthContent>
  );
};

export default PasswordRecoverSent;
