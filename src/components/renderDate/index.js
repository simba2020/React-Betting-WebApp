const renderDate = (param) => {
  const day = new Date(param * 1e3).toDateString().substr(8, 2);
  const month = new Date(param * 1e3).toDateString().substr(4, 3);
  const currentDay = new Date().toDateString().substr(8, 2);
  const currentMonth = new Date().toDateString().substr(4, 3);

  if (day === currentDay && month === currentMonth) {
    return 'Today';
  }

  return day + ' ' + month;
};

export default renderDate;
