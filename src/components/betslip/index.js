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
import BetSlipEntry from './betslipEntry';
import QuickLogin from './quicklogin';
import BetSlipConflict from './betslipConflict';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-switch';
import { JumpingDots } from 'components/jumping-dots';

class BetSlip extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  convertEntryToBetslip = (entries) => {
    return Object.values(entries);
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

  toogleMultiCombinedView = () => {
    this.setState({ multi_combined_opend: !this.state.multi_combined_opend });
  };

  placeBet = () => {
    const { loading, total_stake } = this.state;
    if (loading || Number(total_stake) === 0) {
      return;
    }
    const data = {
      accept_odds: this.state.accept_odd_changes,
    };
    this.setState({ loading: true });
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
        if (err.response && err.response.data.code === 401) {
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
    }

    this.setState({ loading: false });
  }

  clickDeposit = () => {
    this.props.setDepositClick(true);
  };

  render() {
    const {
      multi_combined_opend,
      accept_odd_changes,
      bet_place_success,
      loading,
    } = this.state;

    const {
      conflicts,
      single_bets,
      multi_combined,
      total_stake,
      total_win,
      valid,
      statusMessage,
      status,
      featuredEvents,
      isDraggable
    } = this.props;

    const locationPathName = window.location.pathname;

    return (
      <div className={isDraggable ? 'p-0 mb-2' : 'mb-2 mt-4'}>
        <QuickLogin />
        <div
          className={
            !locationPathName.includes('/sport')
              ? ''
              : featuredEvents.length > 0 &&
                locationPathName.includes('/sport') &&
                locationPathName.split('/').length === 3
              ? 'mt-0'
              : 'mt-176'
          }
        >
          <div id="betslip-header">
            <p className="p-3">Betslip</p>
          </div>
          {single_bets.length || multi_combined.length ? (
            <div>
              {loading ? (
                <JumpingDots />
              ) : (
                <div
                  className={
                    locationPathName === '/' ||
                    (featuredEvents.length > 0 &&
                      locationPathName.includes('/sport') &&
                      locationPathName.split('/').length === 3)
                      ? 'betslip-fixed-container landing-betslip-fixed-container'
                      : this.props.location.pathname.includes('/live')
                      ? 'betslip-fixed-container live-betslip-fixed-container'
                      : 'betslip-fixed-container'
                  }
                >
                  <div className="p-2 ml-2 mr-2 mt-2 odd-change">
                    <div className="custom-switch d-flex justify-content-between align-items-center pl-0">
                      <label className="position-relative w-70 mb-0">
                        <Switch
                          onChange={() =>
                            this.setState({
                              accept_odd_changes: !accept_odd_changes,
                            })
                          }
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
                  {(statusMessage !== null || valid === -1 || status?.betslip === 'insufficent_funds') && (
                    <div className="status-container d-flex flex-column align-items-center mt-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 mb-2" />
                      {statusMessage}
                      {status?.betslip === 'insufficent_funds' && (
                        <Button
                          variant="warning"
                          className="w-100 mt-2 font-weight-bold deposit-btn"
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
                  <div id="betslip-body">
                    <div className="betslip-container">
                      <div className="p-2">
                        {single_bets.length && (
                          <div className="single-container">
                            <p className="betslip-type">
                              Single <span>{single_bets.length}</span>
                            </p>
                            {single_bets.map((bet) => (
                              <BetSlipEntry
                                entry={bet}
                                isSingleBet={true}
                                overflowedMaxStake={
                                  bet.maxStake ? (!(bet.maxStake - bet.stake >= 0)) : false
                                }
                                key={bet.id}
                              />
                            ))}
                          </div>
                        )}
                        {multi_combined.length !== 0 && (
                          <div className="multiple-container mt-2">
                            <div
                              className="d-flex justify-content-between align-items-center cursor multi-combined-container pl-0"
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
                                  <BetSlipEntry
                                    entry={bet}
                                    isSingleBet={false}
                                    overflowedMaxStake={false}
                                    key={bet.id}
                                  />
                                );
                              })}
                          </div>
                        )}
                      </div>
                    </div>
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
                <div className="d-flex p-3 pt-0 justify-content-between total-value-container">
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
            <div className="no-bet-container text-center d-flex flex-column">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <p className="p-2 bet-success">Bet Confirmed!</p>
                <p>Your bet has been placed</p>
              </div>
              <Button variant="warning" className="w-100" onClick={() => this.setState({ bet_place_success: false })}>
                OK
              </Button>
            </div>
          ) : (
            <div className="no-bet-container d-flex flex-column align-items-center justify-content-center p-3 text-center">
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
  featuredEvents: state.football.featuredEvents,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BetSlip));
