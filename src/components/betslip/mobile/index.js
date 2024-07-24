import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  setConflicts,
  setSingleBets,
  setMultiCombined,
  setTotalStake,
  setTotalWin,
  setValid,
  setStatusMessage,
  setStatus,
  setDepositClick,
  setQuickLogin,
} from 'redux/actions';
import BetSlipService from 'services/BetSlipService';
import BetSlipEntry from '../betslipEntry';
import BetSlipConflict from '../betslipConflict';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-switch';
import { JumpingDots } from 'components/jumping-dots';

class BetSlipMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalStake: 0,
      totalWin: 0,
      conflicts: [],
      single_bets: [],
      multi_combined: [],
      total_stake: 0,
      total_win: 0,
      valid: false,
      statusMessage: '',
      status: null,
      multi_combined_opend: true,
      accept_odd_changes: false,
      bet_place_success: false,
      loading: true,
    };
  }

  componentDidMount() {
    BetSlipService.getBetSlips().then((response) => {
      this.updateWithResponse(response);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.betslip_add_data !== this.props.betslip_add_data) {
      this.addToBetSlip();
    }
    if (prevProps.conflicts !== this.props.conflicts) {
      this.setState({ conflicts: this.props.conflicts });
    }
    if (prevProps.single_bets !== this.props.single_bets) {
      this.setState({ single_bets: this.props.single_bets });
    }
    if (prevProps.multi_combined !== this.props.multi_combined) {
      this.setState({ multi_combined: this.props.multi_combined });
    }
    if (prevProps.total_stake !== this.props.total_stake) {
      this.setState({ total_stake: this.props.total_stake });
    }
    if (prevProps.total_win !== this.props.total_win) {
      this.setState({ total_win: this.props.total_win });
    }
    if (prevProps.valid !== this.props.valid) {
      this.setState({ valid: this.props.valid });
    }
    if (prevProps.statusMessage !== this.props.statusMessage) {
      this.setState({ statusMessage: this.props.statusMessage });
    }
    if (prevProps.status !== this.props.status) {
      this.setState({ status: this.props.status });
    }
  }

  convertEntryToBetslip = (entries) => {
    const bets = [];
    var key;
    for (key in entries) {
      bets.push(entries[key]);
    }

    return bets;
  };

  addToBetSlip = () => {
    this.setState({ loading: true });
    BetSlipService.addToBetSlip(this.props.betslip_add_data).then((response) => {
      if (response.success) {
        this.updateWithResponse(response);
      }
    });
  };

  removeAllBets = () => {
    this.setState({ loading: true });
    BetSlipService.deleteAllBetSlips().then((response) => {
      this.updateWithResponse(response);
    });
  };

  placeBet = () => {
    this.setState({ loading: true });
    const data = {
      accept_odds: this.state.accept_odd_changes,
    };
    BetSlipService.placeBetSlips(data)
      .then((response) => {
        if (response.code === 999) {
          this.setState({ bet_place_success: true });
        } else {
          this.setState({ bet_place_success: false });
        }
        this.updateWithResponse(response);
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (err.response.data.code === 401) {
          this.props.setQuickLogin(true);
        }
      });
  };

  updateWithResponse(response) {
    const bets = this.convertEntryToBetslip(response.data.entries);
    const multiples = this.convertEntryToBetslip(response.data.multiplesCombined);

    this.props.setSingleBets(bets);
    this.props.setMultiCombined(multiples);
    this.props.setTotalStake(response.data.totalStake);
    this.props.setTotalWin(response.data.totalWin);
    this.props.setValid(response.data.valid ? 1 : -1);
    this.props.setStatusMessage(response.data.statusMessage);
    this.props.setStatus(response.data.status);

    if (response.data.conflicts) {
      const conflicts = this.convertEntryToBetslip(response.data.conflicts);
      conflicts.forEach((conflict) => {
        const conflictedWithItems = this.convertEntryToBetslip(conflict.c);
        conflict.c = conflictedWithItems;
      });
      this.props.setConflicts(conflicts);
      this.setState({ conflicts: conflicts });
    }

    this.setState({
      single_bets: bets,
      multi_combined: multiples,
      total_stake: response.data.totalStake,
      total_win: response.data.totalWin,
      valid: response.data.valid ? 1 : -1,
      statusMessage: response.data.statusMessage,
      status: response.data.status,
      loading: false,
    });
  }

  clickDeposit = () => {};

  goHome = () => {
    this.props.history.push('/');
  };

  toogleMultiCombinedView = () => {
    this.setState({ multi_combined_opend: !this.state.multi_combined_opend });
  };

  render() {
    const {
      conflicts,
      single_bets,
      multi_combined,
      total_stake,
      total_win,
      multi_combined_opend,
      accept_odd_changes,
      bet_place_success,
      valid,
      statusMessage,
      status,
      loading,
    } = this.state;

    return (
      <div className="mobile-betslip-container w-100">
        <div className="d-flex justify-content-bewteen align-items-center pl-3 header">
          <span onClick={() => this.goHome()}>Back</span>
        </div>
        <div className="main-container p-2">
          {single_bets.length || multi_combined.length ? (
            <div>
              {loading ? (
                <JumpingDots />
              ) : (
                <div className="betslips">
                  <div className="mb-2 p-2 odd-change">
                    <div className="custom-switch d-flex justify-content-between align-items-center pl-0">
                      <label className="position-relative w-75 mb-0">
                        <Switch
                          onChange={() => this.setState({ accept_odd_changes: !accept_odd_changes })}
                          checked={accept_odd_changes}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onColor="#F9BE00"
                          onHandleColor="#161619"
                          offColor="#45494D"
                          offHandleColor="#6F7480"
                          height={22}
                          width={39}
                        />
                        <span className="pt-1 ml-2 position-absolute">Accept odd changes</span>
                      </label>
                      <p className="mb-0" onClick={() => this.removeAllBets()}>
                        Remove All
                      </p>
                    </div>
                  </div>
                  {(valid === -1 || status?.betslip === 'insufficent_funds') && (
                    <div className="status-container d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 mb-2" />
                      {statusMessage}
                      {status?.betslip === 'insufficent_funds' && (
                        <Button
                          variant="warning"
                          className="w-100 mt-2 deposit-btn"
                          onClick={() => this.clickDeposit()}
                        >
                          DEPOSIT
                        </Button>
                      )}
                    </div>
                  )}
                  {conflicts.length !== 0 &&
                    conflicts.map((conflict, index) => {
                      return <BetSlipConflict conflict={conflict} key={index} />;
                    })}
                  <div>
                    {single_bets.length && (
                      <div className="single-container">
                        {single_bets.map((bet) => {
                          return (
                            <BetSlipEntry
                              entry={bet}
                              isSingleBet={true}
                              overflowedMaxStake={bet.maxStake ? (!(bet.maxStake - bet.stake >= 0)) : false}
                              key={bet.id}
                            />
                          );
                        })}
                      </div>
                    )}
                    {multi_combined.length !== 0 && (
                      <div className="multiple-container mt-2">
                        <div
                          className="d-flex justify-content-between align-items-center cursor multi-combined-container"
                          onClick={() => this.toogleMultiCombinedView()}
                        >
                          <p className="betslip-type">Multiple</p>
                          {multi_combined_opend ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                          ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                        </div>
                        {multi_combined_opend &&
                          multi_combined.map((bet) => {
                            return (
                              <BetSlipEntry entry={bet} isSingleBet={false} overflowedMaxStake={false} key={bet.id} />
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="betslip-total-info">
                <div id="betslip-card2" className="p-2">
                  <p>Quick Bets</p>
                  <div className="d-flex mt-1">
                    <div className="w-25 betslip-card2-bets">
                      <p>200</p>
                    </div>
                    <div className="w-25 betslip-card2-bets">
                      <p>200</p>
                    </div>
                    <div className="w-25 betslip-card2-bets">
                      <p>200</p>
                    </div>
                    <div className="w-25 betslip-card2-bets">
                      <p>200</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex p-3 justify-content-between total-value-container">
                  <div className="total-value">
                    <p>Total Stake</p>
                    <p>{total_stake}</p>
                  </div>
                  <div className="total-value">
                    <p>Total Win</p>
                    <p>{total_win}</p>
                  </div>
                </div>
                <Button variant="warning" id="place-bet-btn" onClick={() => this.placeBet()}>
                  Place Your Bet
                </Button>
              </div>
            </div>
          ) : bet_place_success ? (
            <div className="no-bet-container-mobile text-center d-flex flex-column">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <p className="p-2 bet-success">Bet Confirmed!</p>
                <p>Your bet has been placed</p>
              </div>
              <Button variant="warning" className="w-100" onClick={this.goHome}>
                OK
              </Button>
            </div>
          ) : (
            <div className="no-bet-container-mobile d-flex flex-column align-items-center justify-content-center p-3 text-center">
              <p className="p-2">No bets selected</p>
              <p>Place a bet</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  betslip_add_data: state.market.betslip_add_data,
  conflicts: state.betslip.betslip_conflicts,
  single_bets: state.betslip.betslip_single_bets,
  multi_combined: state.betslip.betslip_multi_combined,
  total_stake: state.betslip.betslip_total_stake,
  total_win: state.betslip.betslip_total_win,
  valid: state.betslip.betslip_valid,
  statusMessage: state.betslip.betslip_status_message,
  status: state.betslip.betslip_status,
  quickLogin: state.betslip.betslip_quicklogin,
});

const mapDispatchToProps = (dispatch) => ({
  setConflicts: (payload) => dispatch(setConflicts(payload)),
  setSingleBets: (payload) => dispatch(setSingleBets(payload)),
  setMultiCombined: (payload) => dispatch(setMultiCombined(payload)),
  setTotalStake: (payload) => dispatch(setTotalStake(payload)),
  setTotalWin: (payload) => dispatch(setTotalWin(payload)),
  setValid: (payload) => dispatch(setValid(payload)),
  setStatusMessage: (payload) => dispatch(setStatusMessage(payload)),
  setStatus: (payload) => dispatch(setStatus(payload)),
  setDepositClick: (payload) => dispatch(setDepositClick(payload)),
  setQuickLogin: (payload) => dispatch(setQuickLogin(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BetSlipMobile));
