import { AuthContent } from 'components/layout';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  plane: {
    width: '250px',
    height: 'auto',
  },
  verify: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  email: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const RegisterSuccess = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useLocation();

  if (!state || !state.email) {
    history.replace('/register');

    return null;
  }

  return (
    <AuthContent title="Registration Success">
      <Box flex={1} display="flex" flexDirection="column" alignItems="center">
        <img className={classes.plane} src="/assets/auth/paper-plane.svg" alt="Registration Success" />
        <Typography className={classes.verify} variant="h4" color="textSecondary">
          Verify Email
        </Typography>
        <Typography color="textSecondary" align="center">
          Please verify that your email address is{' '}
          <Typography component="span" className={classes.email}>
            {state.email}
          </Typography>
        </Typography>
      </Box>
    </AuthContent>
  );
};

export default RegisterSuccess;
