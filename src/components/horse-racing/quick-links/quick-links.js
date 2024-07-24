import React from 'react';

import classes from './quick-links.module.scss';

const QuickLinks = (props) => {
  const { loading } = props;

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <div className={classes.quickLinks}>
      <h3>Quick Links</h3>
    </div>
  );
};

export default QuickLinks;
