import { IconButton, InputAdornment } from '@material-ui/core';
import TextField from '../text-field/text-field';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';

const useInputAdornmentStyles = makeStyles({
  root: {},
});

const PasswordField = (props) => {
  const [type, setType] = useState('password');
  const classes = useInputAdornmentStyles();

  return (
    <TextField
      type={type}
      endAdornment={
        <InputAdornment classes={classes} position="end">
          <IconButton
            edge="end"
            aria-label="toggle password visibility"
            onClick={() => setType((prevType) => (prevType === 'password' ? 'text' : 'password'))}
          >
            {type === 'text' ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  );
};

export default PasswordField;
