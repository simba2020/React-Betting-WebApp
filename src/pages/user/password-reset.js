import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AuthContent } from 'components/layout';
import { Button, PasswordField } from 'components/form';
import { resetPassword } from '../../redux/reducers/auth';
import { unwrapResult } from '@reduxjs/toolkit';
import { selectIsResettingPassword } from '../../redux/selectors/auth';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(5),
  },
}));

const PasswordReset = () => {
  const classes = useStyles();
  const { token = '' } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const isResettingPassword = useSelector(selectIsResettingPassword);

  const [data, setData] = useState({
    password: {
      first: '',
      second: '',
    },
    token: '',
  });
  const [errors, setErrors] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => setData((prev) => ({ ...prev, token })), [token]);

  const dispatchConfirm = () => {
    setErrors(null);

    const redirect = (path) => setTimeout(() => history.replace(path), 3500);

    (async () => {
      const result = await dispatch(resetPassword(data))
        .then(unwrapResult)
        .catch((e) => e);

      if (!result.success) {
        if (Array.isArray(result.data) && !result.data.length) {
          return toast.error(result.message);
        }

        return setErrors(result.data);
      }

      setResetSuccess(true);
      toast.success(result.message);
      redirect('/login');
    })();
  };

  return (
    <AuthContent title="Reset Password" subtitle="Set up new password">
      <PasswordField
        disasbled={isResettingPassword || resetSuccess}
        errors={errors}
        className={classes.marginBottom}
        name="password.first"
        label="New Password"
        placeholder="Create new password"
        value={data.password.first}
        onChange={(e) => setData((prev) => ({ ...prev, password: { ...prev.password, first: e.target.value } }))}
      />
      <PasswordField
        disasbled={isResettingPassword || resetSuccess}
        errors={errors}
        className={classes.marginBottom}
        name="password.second"
        label="Confirm Password"
        placeholder="Confirm new password"
        value={data.password.second}
        onChange={(e) => setData((prev) => ({ ...prev, password: { ...prev.password, second: e.target.value } }))}
      />
      <Button onClick={dispatchConfirm} disabled={isResettingPassword || resetSuccess} loading={isResettingPassword}>
        Reset Password
      </Button>
    </AuthContent>
  );
};

export default PasswordReset;
