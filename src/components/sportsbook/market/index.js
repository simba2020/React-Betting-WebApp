import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import eventBus from 'services/eventBus';
import BetSlipService from 'services/BetSlipService';
import { parseFractionText } from 'utils/Utils';
import {
  setBetslipAddData,
  setConflicts,
  setSingleBets,
  setMultiCombined,
  setTotalStake,
  setTotalWin,
  setValid,
  setStatusMessage,
  setStatus,
} from 'redux/actions';

class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      added: false,
    };
  }

  componentDidMount() {
    this.setState({
      odds: this.props.odds.rate,
      oddsAmerican: this.props.odds.rateAmerican,
      oddsFractional: this.props.odds.rateFraction,
      changeState: '',
    });

    const oddsId = this.props.odds.id;

    eventBus.on('ODDS_' + oddsId, (data) => {
      this.setState(data);

      clearTimeout(this.timeout);
      setTimeout(() => {
        this.timeout = setTimeout(() => {
          const state = this.state;
          state.changeState = '';
          this.setState(state);
        }, 3000);
      });
    });
    this.setState({
      added: this.checkAddedBetSlip(),
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.single_bets !== this.props.single_bets) {
      this.setState({
        added: this.checkAddedBetSlip(),
      });
    }
  }

  checkAddedBetSlip = () => {
    return this.props.single_bets.some((item) => item.eventId === this.props.eventId && item.id === this.props.odds.id);
  };

  convertEntryToBetslip = (entries) => {
    return Object.values(entries);
  };

  addToBetSlip = () => {
    const payload = {
      eventId: parseInt(this.props.eventId),
      id: this.props.odds.id,
      odds: this.props.odds.rate,
    };
    this.props.setBetslipAddData(payload);
  };

  removeBet = () => {
    BetSlipService.deleteBetSlipById(this.props.odds.id).then((response) => {
      this.updateStateFromResponse(response);
      if (response.data.conflicts) {
        const conflicts = this.convertEntryToBetslip(response.data.conflicts);
        // just to fix errors, don't take my name on this piece of "code"
        conflicts.forEach((conflict) => {
          conflict.c = this.convertEntryToBetslip(conflict.c);
        });
        this.props.setConflicts(conflicts);
      }
    });
  };

  updateStateFromResponse(response) {
    const bets = this.convertEntryToBetslip(response.data.entries);
    const multiples = this.convertEntryToBetslip(response.data.multiplesCombined);

    this.props.setSingleBets(bets);
    this.props.setMultiCombined(multiples);
    this.props.setTotalStake(response.data.totalStake);
    this.props.setTotalWin(response.data.totalWin);
    this.props.setValid(response.data.valid ? 1 : -1);
    this.props.setStatusMessage(response.data.statusMessage);
    this.props.setStatus(response.data.status);
  }

  handleClickBetSlip = (e) => {
    e.stopPropagation();
    if (this.state.added) {
      this.removeBet();
    } else {
      this.addToBetSlip();
    }
  };

  render() {
    const oddType = this.props.odd;
    const rate = this.state.odds;
    const american = this.state.oddsAmerican;
    const fractional = this.state.oddsFractional;
    const columns = this.props.inRow;
    const id = this.props.odds.id;
    const useDefaults = this.props.useDefaults;
    const name = this.props.title;
    const isPromotion = this.props.isPromotion;
    const index = this.props.index;
    const fraction = parseFractionText(fractional);

    let boxstateClass = 'score-div mr-2';
    if (isPromotion) {
      boxstateClass =
        index === columns - 1
          ? 'score-div score-wrap mr-0 d-flex align-items-center justify-content-center'
          : 'score-div score-wrap mr-2 d-flex align-items-center justify-content-center';
    }
    let title = false;
    if (!useDefaults && name) {
      boxstateClass = 'match-result-body-cell p-2 mr-2';
      title = <p className="name">{name}</p>;
    }

    if (this.props.coupon) {
      boxstateClass = `${boxstateClass} d-flex flex-column this-is-coupon justify-content-center`;
    }

    if (this.props.defaultParity) {
      boxstateClass = `${boxstateClass} default-parity`;
    }

    const outLineClass = this.state.added ? 'addedBet-div' : '';

    const oddsWrap = ['values'];
    if (oddType.includes('Fractional')) {
      oddsWrap.push('fraction');
    }

    if (isPromotion) {
      oddsWrap.push('small-values');
    }

    const classes = ['market', 'p-0', `market-priority-${this.props.odds.p}`];

    if (window.location.pathname.includes('/event') || window.location.pathname === '/live') {
      classes.push('mt-2');
    } else {
      classes.push('mt-011');
    }

    const extraStyle = {};

    if (!this.props.coupon || this.props.mobile) {
      classes.push('col-' + 12 / columns);
    } else {
      extraStyle['flex'] = 1;
    }

    return (
      <div style={extraStyle} className={classes.join(' ')} data-ref={id} onClick={(e) => this.handleClickBetSlip(e)}>
        <div className={[boxstateClass, outLineClass].join(' ')}>
          {title}
          {oddType !== null ? (
            <div className={oddsWrap.join(' ')}>
              {oddType.includes('Decimal') ? rate : null}
              {oddType.includes('American') ? american : null}
              {oddType.includes('Fractional') && fraction ? (
                <div className="fraction">
                  <span className="fraction-numerator">{fraction.numerator}</span>
                  <span className="fraction-denominator">{fraction.denominator}</span>
                </div>
              ) : null}
            </div>
          ) : null}
          {this.state.changeState === '+' ? (
            <img
              src={'/assets/image/market-view/green-up-right-arrow.svg'}
              className={
                isPromotion
                  ? 'odds-arrow active-green-arrow'
                  : boxstateClass.includes('score-div mr-2')
                  ? 'odds-arrow active-green-arrow '
                  : 'odds-arrow active-green-arrow'
              }
              alt="img"
            />
          ) : (
            <img src={'/assets/image/market-view/green-up-right-arrow.svg'} className="odds-arrow" alt="img" />
          )}
          {this.state.changeState === '-' ? (
            <img
              src={'/assets/image/market-view/red-up-right-arrow.svg'}
              className={
                isPromotion
                  ? 'red-odds-arrow active-red-arrow'
                  : boxstateClass.includes('score-div mr-2')
                  ? 'red-score-odds-arrow active-red-arrow'
                  : 'red-odds-arrow active-red-arrow'
              }
              alt="img"
            />
          ) : (
            <img
              src={'/assets/image/market-view/red-up-right-arrow.svg'}
              className={
                isPromotion
                  ? 'red-odds-arrow'
                  : boxstateClass.includes('score-div mr-2')
                  ? 'red-score-odds-arrow'
                  : 'red-odds-arrow '
              }
              alt="img"
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  odd: state.football.odd,
  single_bets: state.betslip.betslip_single_bets,
});

const mapDispatchToProps = (dispatch) => ({
  setBetslipAddData: (payload) => dispatch(setBetslipAddData(payload)),
  setConflicts: (payload) => dispatch(setConflicts(payload)),
  setSingleBets: (payload) => dispatch(setSingleBets(payload)),
  setMultiCombined: (payload) => dispatch(setMultiCombined(payload)),
  setTotalStake: (payload) => dispatch(setTotalStake(payload)),
  setTotalWin: (payload) => dispatch(setTotalWin(payload)),
  setValid: (payload) => dispatch(setValid(payload)),
  setStatusMessage: (payload) => dispatch(setStatusMessage(payload)),
  setStatus: (payload) => dispatch(setStatus(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Market));
