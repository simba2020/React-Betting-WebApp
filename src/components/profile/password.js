import React from 'react';
import Env from 'utils/Env';

const Password = () => {
  return (
    <iframe
      src={Env.URL + '#password'}
      width="100%"
      style={{ minHeight: '99%', border: 'none' }}
      title="login"
    ></iframe>
  );
};

export default Password;
