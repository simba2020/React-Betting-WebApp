import React, { useState, useEffect } from 'react';

const Balance = ({ active }) => {
  const [amount, setAmount] = useState(active);

  useEffect(() => {
    setAmount(active);
  }, [active]);

  return <p className="mr-2 ml-2">{amount}</p>;
};

export default Balance;
