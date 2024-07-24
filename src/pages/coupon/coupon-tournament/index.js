import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SportService from 'services/SportService';
import { connect } from 'react-redux';
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
import QuickLogin from 'components/betslip/quicklogin';
import { DebounceInput } from 'react-debounce-input';
import { Button } from 'react-bootstrap';
import BetSlipService from 'services/BetSlipService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import { JumpingDots } from 'components/jumping-dots';
import { CouponRow } from './coupon-row';

class CouponTournament extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      loading: true,
      stake: null,
      debounceInputFocused: false,
      odds: 0,
      betPlaced: false,
      showErrorMessage: false,
      placingBet: false,
    };
  }

  componentDidMount() {
    const { sport, tournament } = this.props.match.params;

    SportService.getTournament(`${sport}/${tournament}`).then((res) => {
      const selectedMarketGroup = this.props.location.state.marketGroup;
      const matches = res.data.entries
        .filter((match) => Object.keys(match.marketGroups).some((key) => key === selectedMarketGroup))
        .map((match) => ({
          ...match,
          marketGroups: Object.entries(match.marketGroups).reduce((accu, [key, marketGroup]) => {
            if (key === selectedMarketGroup) {
              return {
                ...accu,
                [key]: {
                  ...marketGroup,
                  markets: [
                    ...marketGroup.markets.filter((market) => market.c === 'p'),
                    ...marketGroup.markets.filter((market) => market.c === 's'),
                    ...marketGroup.markets.filter((market) => market.c === 'n'),
                  ],
                  columns: 4,
                },
              };
            }

            return {
              ...accu,
              [key]: marketGroup,
            };
          }, {}),
        }))
        .sort((a, b) => a.starts - b.starts);

      this.setState(
        {
          matches,
          loading: false,
        },
        () => {
          window.scrollTo(0, 0);
        }
      );
    });
    this.removeAllBets();
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.betslip_add_data) !== JSON.stringify(this.props.betslip_add_data)) {
      this.checkInSameRow().then(() => {
        this.addToBetslip();
      });
    }
    if (
      JSON.stringify(prevProps.single_bets) !== JSON.stringify(this.props.single_bets) ||
      JSON.stringify(prevProps.multi_combined) !== JSON.stringify(this.props.multi_combined)
    ) {
      const { single_bets, multi_combined } = this.props;
      const odds = multi_combined.length
        ? Number(multi_combined[0].odds).toFixed(2)
        : single_bets.length
        ? Number(single_bets[0].odds).toFixed(2)
        : 0;
      this.setState({ odds });
    }
  }

  componentWillUnmount() {
    this.removeAllBets();
  }

  checkInSameRow = async () => {
    try {
      const singleBets = this.props.single_bets;
      const selectedEventId = this.props.betslip_add_data.eventId;
      const betToRemove = singleBets.find((bet) => parseInt(bet.eventId) === selectedEventId);
      if (betToRemove) {
        await BetSlipService.deleteBetSlipById(betToRemove.id);
      }
    } catch (err) {}
  };

  addToBetslip = () => {
    const singleBets = this.props.single_bets;
    const selectedEventId = this.props.betslip_add_data.eventId;
    const betToRemove = singleBets.find((bet) => bet.eventId === selectedEventId);
    if (betToRemove) {
      this.removeBetById(betToRemove.id);
    }
    BetSlipService.addToBetSlip(this.props.betslip_add_data).then((response) => {
      this.updateWithResponse(response);
    });
  };

  removeAllBets = () => {
    BetSlipService.deleteAllBetSlips().then((response) => {
      this.updateWithResponse(response);
    });
  };

  convertEntryToBetslip = (entries) => {
    const bets = [];
    for (const key in entries) {
      bets.push(entries[key]);
    }

    return bets;
  };

  updateWithResponse = (response) => {
    const bets = this.convertEntryToBetslip(response.data.entries);
    const multiples = this.convertEntryToBetslip(response.data.multiplesCombined);

    this.props.setSingleBets(bets);
    this.props.setMultiCombined(multiples);
    this.props.setTotalStake(response.data.totalStake);
    this.props.setTotalWin(response.data.totalWin);
    this.props.setValid(response.data.valid ? 1 : -1);
    this.props.setStatusMessage(response.data.statusMessage);
    this.props.setStatus(response.data.status);

    const odds = multiples.length
      ? Number(multiples[0].odds).toFixed(2)
      : bets.length
      ? Number(bets[0].odds).toFixed(2)
      : 0;

    this.setState({ odds, betPlaced: false });

    if (response.data.conflicts) {
      const conflicts = this.convertEntryToBetslip(response.data.conflicts);
      conflicts.forEach((conflict) => {
        const conflictedWithItems = this.convertEntryToBetslip(conflict.c);
        conflict.c = conflictedWithItems;
      });
      this.props.setConflicts(conflicts);
    }
  };

  handleStakeChange = (e) => {
    const value = e.target.value;
    this.setState({ stake: value });

    let data;
    if (this.props.multi_combined.length === 0) {
      data = {
        id: this.props.single_bets[0].id,
        stake: value,
      };
    } else {
      data = {
        id: this.props.multi_combined[0].id,
        stake: value,
      };
    }
    BetSlipService.setBetSlipStake(data).then((response) => {
      this.updateWithResponse(response);
    });
  };

  focusStakeInput = () => {
    this.setState({ debounceInputFocused: true });
  };

  blurStakeInput = () => {
    this.setState({ debounceInputFocused: false });
  };

  placeCouponBet = () => {
    const { stake } = this.state;
    if (stake === null || stake === '0' || stake === '' || !this.props.single_bets?.length) {
      return;
    }
    const data = {
      accept_odds: false,
    };
    this.setState({ placingBet: true, betPlaced: false });
    BetSlipService.placeBetSlips(data)
      .then((response) => {
        const { statusMessage, valid, status } = response.data;
        if (statusMessage === null || valid === false || status?.betslip === 'insufficent_funds') {
          this.setState({ showErrorMessage: true });
        } else {
          this.setState({ showErrorMessage: false });
        }
        this.updateWithResponse(response);
        this.setState({ betPlaced: true, placingBet: false });
        if (valid) {
          this.setState({ stake: '' });
        }
      })
      .catch((err) => {
        if (err.response && err.response.data.code === 401) {
          this.setState({ placingBet: false });
          this.props.setQuickLogin(true);
        }
      });
  };

  render() {
    const { placingBet } = this.state;
    const selectedMarketGroup = this.props.location.state.marketGroup;
    const displayName = this.props.location.state.displayName;
    const { sport } = this.props.match.params;
    const { matches, loading, debounceInputFocused, stake, odds, betPlaced, showErrorMessage } = this.state;
    const { total_win, single_bets, status, statusMessage } = this.props;

    let matchBoxStyle = 'd-flex flex-column match-box';

    if (showErrorMessage || status?.betslip === 'insufficent_funds') {
      matchBoxStyle += ' message-big';
    }

    if (loading) {
      return (
        <div className="pt-112 coupon-page d-flex align-items-center">
          <JumpingDots />
        </div>
      );
    }

    return (
      <div className="mx-md-4 pt-3 px-md-3 pb-md-3 d-flex flex-column coupon-tournament">
        <QuickLogin />
        <div className="label ml-2 d-md-block d-none">
          <span>{`${sport} `}</span>
          <span>{`${selectedMarketGroup} Coupon`}</span>
        </div>
        <div className="main-container mt-2 p-1 p-md-0 d-flex flex-column align-items-center position-relative">
          <div className={matchBoxStyle}>
            <div className="title p-2">{displayName}</div>
            {matches.map((match, index) => {
              return <CouponRow match={match} selectedMarketGroup={selectedMarketGroup} key={index} />;
            })}
          </div>
          <div className="place-bet d-md-flex d-none align-items-center justify-content-end p-3 ml-0 w-100">
            {betPlaced && !showErrorMessage && (
              <div className="text-center mr-auto ml-auto">
                <div className="bet-success-title">Bet Confirmed!</div>
                <div className="bet-success-description">Your bet has been placed</div>
              </div>
            )}
            {status?.betslip === 'insufficent_funds' && (
              <>
                {statusMessage}
                <Button
                  variant="warning"
                  className="ml-2 deposit-btn mr-2"
                  onClick={() => this.props.setDepositClick(true)}
                >
                  DEPOSIT
                </Button>
              </>
            )}
            <div className="d-flex">
              <div className={debounceInputFocused ? 'coupon-stake mr-2 betslip-stake-active' : 'coupon-stake mr-2'}>
                <p className="stake">Stake</p>
                <DebounceInput
                  type="number"
                  debounceTimeout={500}
                  className="form-control stake-input"
                  value={stake}
                  disabled={!single_bets.length}
                  onChange={this.handleStakeChange}
                  onFocus={this.focusStakeInput}
                  onBlur={this.blurStakeInput}
                />
              </div>
              <div>
                <Button className="h-100" variant="warning" onClick={() => this.placeCouponBet()}>
                  {placingBet ? <Spinner animation="border" className="ml-4 mr-4" /> : 'Place Your Bet'}
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <div className="ml-3">
                  Return Odds
                  <span className="odds-value ml-2">{odds}</span>
                </div>
                <div className="ml-3">
                  You Win
                  <span className="odds-value ml-2">{Number(total_win).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="d-md-none d-flex flex-column place-bet p-3 w-100">
            {betPlaced && !showErrorMessage && (
              <div className="d-flex flex-wrap justify-content-center align-items-center mb-2">
                <div className="bet-success-title">Bet Confirmed!</div>
                <div className="bet-success-description">Your bet has been placed</div>
              </div>
            )}
            {status?.betslip === 'insufficent_funds' && (
              <div className="d-flex flex-wrap justify-content-center align-items-center mb-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                {statusMessage}
                {status?.betslip === 'insufficent_funds' && (
                  <Button
                    variant="warning"
                    className="ml-2 deposit-btn"
                    onClick={() => this.props.setDepositClick(true)}
                  >
                    DEPOSIT
                  </Button>
                )}
              </div>
            )}
            <div className="d-flex justify-content-between">
              <div className="d-flex col-6 align-items-center text-left p-0">
                <span className="p-0">Return Odds</span>
                <span className="odds-value p-0 ml-2">{odds}</span>
              </div>
              <div className="d-flex col-6 align-items-center justify-content-end text-left p-0">
                <span className="p-0">You Win</span>
                <span className="odds-value p-0 ml-2">{Number(total_win).toFixed(2)}</span>
              </div>
            </div>
            <div className="d-flex flex-column mt-2">
              <div className={debounceInputFocused ? 'coupon-stake mr-2 betslip-stake-active' : 'coupon-stake mr-2'}>
                <p className="stake">Stake</p>
                <DebounceInput
                  type="number"
                  debounceTimeout={500}
                  className="form-control stake-input"
                  value={stake}
                  disabled={!single_bets.length}
                  onChange={this.handleStakeChange}
                  onFocus={this.focusStakeInput}
                  onBlur={this.blurStakeInput}
                />
              </div>
              <div className="mt-2">
                <Button className="w-100" variant="warning" onClick={() => this.placeCouponBet()}>
                  Place Your Bet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  betslip_add_data: state.market.betslip_add_data,
  single_bets: state.betslip.betslip_single_bets,
  multi_combined: state.betslip.betslip_multi_combined,
  total_stake: state.betslip.betslip_total_stake,
  total_win: state.betslip.betslip_total_win,
  statusMessage: state.betslip.betslip_status_message,
  valid: state.betslip.betslip_valid,
  status: state.betslip.betslip_status,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CouponTournament));
