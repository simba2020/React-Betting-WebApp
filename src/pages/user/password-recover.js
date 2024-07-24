import { AuthContent } from 'components/layout';
import { Button, TextField } from 'components/form';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from 'redux/actions';
import { selectIsRecoveringPassword } from '../../redux/selectors/auth';
import { unwrapResult } from '@reduxjs/toolkit';

const PasswordRecover = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isRecoveringPassword = useSelector(selectIsRecoveringPassword);

  const [email, setEmail] = useState('');

  const dispatchRecover = () => {
    (async () => {
      const response = await dispatch(forgotPassword(email))
        .then(unwrapResult)
        .catch((e) => e);

      if (response.success) {
        history.push('/user/password-recover/sent', { message: response.data.message });
      }
    })();
  };

  return (
    <AuthContent title="Recover Password">
      <TextField
        disabled={isRecoveringPassword}
        name="email"
        label="Email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb={5}
      />
      <Button disabled={isRecoveringPassword} loading={isRecoveringPassword} onClick={() => dispatchRecover()} mb={3}>
        Recover Password
      </Button>
      <Button variant="outlined" color="primary" onClick={() => history.push('/login')}>
        Cancel
      </Button>
    </AuthContent>
  );
};

export default PasswordRecover;
