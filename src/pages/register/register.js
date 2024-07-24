import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContent } from 'components/layout';
import { Button, PasswordField, TextField, Checkbox } from 'components/form';
import { register } from 'redux/actions';
import { selectUserInfo } from 'redux/selectors/user';
import { useHistory } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(5),
  },
}));

const Register = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const { isRegistering } = useSelector(selectUserInfo);

  const [data, setData] = useState({
    name: '',
    email: '',
    password: {
      first: '',
      second: '',
    },
  });
  const [consent, setConsent] = useState({
    age: false,
    rules: false,
    marketing: false,
  });
  const [errors, setErrors] = useState(null);

  const openLink = (e, link) => {
    // TODO remove and refactor, just copied this s**t from CP
    e.preventDefault();

    const data = {
      link,
      popup: true,
    };

    switch (link) {
      case 'terms-and-conditions':
        data.name = 'Terms and Conditions';
        break;
      case 'privacy-policy':
        data.name = 'Privacy Policy';
        break;
      default:
        break;
    }

    window.postMessage({ type: 'showFooterModal', data }, '*');
  };

  const handleConsent = (e) => {
    setConsent((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const isValid = () => {
    return consent.age && consent.rules;
  };

  const submit = async () => {
    setErrors(null);

    const response = await dispatch(register(data))
      .then(unwrapResult)
      .catch((e) => e);

    if (!response.success) {
      setErrors(response.data);

      return;
    }

    switch (response.type) {
      case 'signin':
        history.replace('/');
        break;
      case 'activation':
        history.replace('/register/success', { email: data.email });
        break;
      default:
        break;
    }
  };

  return (
    <AuthContent title="Register">
      <TextField
        errors={errors}
        name="name"
        className={classes.marginBottom}
        label="Name"
        placeholder="Your name"
        value={data.name}
        onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
      />
      <TextField
        errors={errors}
        name="email"
        className={classes.marginBottom}
        label="Email"
        placeholder="Your email"
        value={data.email}
        onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
      />
      <PasswordField
        name="password"
        className={classes.marginBottom}
        label="Password"
        placeholder="Create password"
        value={data.password.first}
        onChange={(e) => setData((prev) => ({ ...prev, password: { first: e.target.value, second: e.target.value } }))}
      />
      <Checkbox checked={consent.age} name="age" value={true} onChange={handleConsent}>
        I confirm that I am of legal age to gamble *
      </Checkbox>
      <Checkbox checked={consent.rules} name="rules" value={true} onChange={handleConsent}>
        I accept the{' '}
        <Link underline="always" onClick={(e) => openLink(e, 'terms-and-conditions')}>
          Terms and Conditions
        </Link>{' '}
        and{' '}
        <Link underline="always" onClick={(e) => openLink(e, 'privacy-policy')}>
          Privacy Policy
        </Link>{' '}
        *
      </Checkbox>
      <Checkbox
        className={classes.marginBottom}
        checked={consent.marketing}
        name="marketing"
        value={true}
        onChange={handleConsent}
      >
        I consent to marketing promotions
      </Checkbox>
      <Button onClick={() => submit()} disabled={!isValid() || isRegistering} loading={isRegistering}>
        Create Account
      </Button>
    </AuthContent>
  );
};

export default Register;
