export const handleErrorResponseObject = (error) => {
  if (error.response && error.response.data.error) {
    throw new Error(error.response.data.error);
  } else if (error.response) {
    throw new Error(error.response.statusText);
  } else {
    throw new Error(error.message);
  }
};

export const parseFractionText = (text) => {
  if (typeof text !== 'string') {
    return null;
  }

  const substrings = text.split('/');
  if (substrings.length !== 2) {
    return null;
  }

  const [numerator, denominator] = substrings;

  return { numerator, denominator };
};
