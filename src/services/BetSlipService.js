import ApiService from 'services/ApiService';

const BetSlipService = (() => {
  const addToBetSlip = async (data) => {
    return await ApiService.getInstance()
      .put('/venus/bet/betslip', data)
      .then((res) => res.data);
  };

  const deleteAllBetSlips = async () => {
    return await ApiService.getInstance()
      .delete('/venus/bet/betslip')
      .then((res) => res.data);
  };

  const deleteBetSlipById = async (id) => {
    return await ApiService.getInstance()
      .delete(`/venus/bet/betslip/${id}`)
      .then((res) => res.data);
  };

  const setBetSlipStake = async (data) => {
    return await ApiService.getInstance()
      .patch('/venus/bet/betslip/stake', data)
      .then((res) => res.data);
  };

  const setBetSlipEachWay = async (id, state) => {
    return await ApiService.getInstance()
      .patch('/venus/bet/betslip/eachway', {
        id: id,
        eachway: state ? 1 : 0,
      })
      .then((res) => res.data);
  };

  const getBetSlips = async () => {
    return await ApiService.getInstance()
      .get('/venus/bet/betslip')
      .then((res) => res.data);
  };

  const placeBetSlips = async (data) => {
    return await ApiService.getInstance()
      .post('/venus/bet/betslip/place', data)
      .then((res) => res.data);
  };

  return {
    addToBetSlip,
    deleteAllBetSlips,
    deleteBetSlipById,
    setBetSlipStake,
    setBetSlipEachWay,
    getBetSlips,
    placeBetSlips,
  };
})();

export default BetSlipService;
