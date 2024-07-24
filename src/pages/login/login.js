import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import { TextField, PasswordField, Button } from 'components/form';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from 'redux/actions';
import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { selectUserInfo } from 'redux/selectors/user';
import { AuthContent } from 'components/layout';

const useStyles = makeStyles((theme) => ({
  grid: {
    flex: 1,
  },
  itemGuy: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  guyWrapper: {
    [theme.breakpoints.down('sm')]: {
      height: '275px',
      overflow: 'hidden',
    },
  },
  guy: {
    height: '500px',
    width: 'auto',
  },
  itemLoginBox: {
    display: 'flex',
    alignItems: 'center',
  },
  loginBox: {
    [theme.breakpoints.only('xs')]: {
      marginLeft: theme.spacing(4),
    },
    [theme.breakpoints.only('sm')]: {
      marginLeft: theme.spacing(8),
    },
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  subtitle: {
    marginBottom: theme.spacing(6),
  },
  email: {
    marginBottom: theme.spacing(5),
  },
  password: {
    marginBottom: theme.spacing(5),
  },
  login: {
    marginBottom: theme.spacing(3),
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { isLoggingIn } = useSelector(selectUserInfo);

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const dispatchLogin = () => {
    dispatch(login(credentials))
      .then(unwrapResult)
      .then(() => history.push('/'));
  };

  return (
    <AuthContent
      title="Login"
      subtitle={
        <>
          if you don't have account{' '}
          <Link color="primary" underline="always" onClick={() => history.push('/register')}>
            Register
          </Link>
        </>
      }
    >
      <TextField
        disabled={isLoggingIn}
        className={classes.email}
        label="Email"
        placeholder="Your email"
        value={credentials.username}
        onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
      />
      <PasswordField
        disabled={isLoggingIn}
        className={classes.password}
        label="Password"
        placeholder="Type Password"
        value={credentials.password}
        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
      />
      <Button className={classes.login} onClick={dispatchLogin} disabled={isLoggingIn} loading={isLoggingIn}>
        Login
      </Button>
      <Button variant="outlined" color="primary" onClick={() => history.push('/user/password-recover')}>
        Recover Password
      </Button>
    </AuthContent>
  );
};

export default Login;
