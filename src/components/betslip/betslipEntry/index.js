import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import BetSlipService from 'services/BetSlipService';
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
} from 'redux/actions';
import { Checkbox } from 'semantic-ui-react';
import {
  LargeDesktop,
  MediumDesktop,
  SmallDesktop,
  Tablet,
  Mobile
} from 'components/media-queries'
import { StakeWinInput } from './stakeWinInput';

class BetSlipEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entry: this.props.entry,
      isSingleBet: this.props.isSingleBet,
      debounceInputFocused: false,
    };
  }

  componentDidMount() { }

  componentDidUpdate(prevProps) {
    if (prevProps.entry !== this.props.entry) {
      this.setState({ entry: this.props.entry });
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

  handleStakeChange = (e) => {
    const value = e.target.value;
    const entry = { ...this.state.entry };
    entry.stake = value;
    this.setState({ entry: entry });
    const data = {
      id: entry.id,
      stake: entry.stake,
    };
    BetSlipService.setBetSlipStake(data).then((response) => {
      const currentEntries = this.state.isSingleBet
        ? this.convertEntryToBetslip(response.data.entries)
        : this.convertEntryToBetslip(response.data.multiplesCombined);
      const currentEntry = currentEntries.find((entry) => entry.id === this.state.entry.id);

      if (this.state.isSingleBet) {
        entry.win = currentEntry ? currentEntry.win : 0;
      } else {
        entry.totalWin = currentEntry ? currentEntry.totalWin : 0;
      }
      this.updateStateFromResponse(response);
    });
  };

  removeBetById = (id) => {
    BetSlipService.deleteBetSlipById(id).then((response) => {
      this.updateStateFromResponse(response);
      if (response.data.conflicts) {
        const conflicts = this.convertEntryToBetslip(response.data.conflicts);
        this.props.setConflicts(conflicts);
      }
    });
  };

  focusStakeInput = () => {
    this.setState({ debounceInputFocused: true });
  };

  switchEachWay = (id, checked) => {
    BetSlipService.setBetSlipEachWay(id, checked).then((response) => {
      this.updateStateFromResponse(response);
      if (response.data.conflicts) {
        const conflicts = this.convertEntryToBetslip(response.data.conflicts);
        this.props.setConflicts(conflicts);
      }
    });
  };

  blurStakeInput = () => {
    this.setState({ debounceInputFocused: false });
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

  renderStakeWin = (entry, singleRow) => {
    const { debounceInputFocused, overflowedMaxStake, isSingleBet } = this.state;

    return (
      <StakeWinInput
        entry={entry}
        debounceInputFocused={debounceInputFocused}
        overflowedMaxStake={overflowedMaxStake}
        isSingleBet={isSingleBet}
        singleRow={singleRow}
        handleStakeChange={this.handleStakeChange}
        focusStakeInput={this.focusStakeInput}
        blurStakeInput={this.blurStakeInput}
      />
    );
  }

  render() {
    const oddType = this.props.odd;
    const { overflowedMaxStake } = this.props;
    const { entry, isSingleBet } = this.state;
    const shouldShowMessage =
      entry.locked ||
      entry.unavailable ||
      overflowedMaxStake ||
      entry.eachwayInvalid ||
      (entry.oddsChange !== false && entry.message !== null);

    return (
      <div id="betslip-card1">
        <div className="d-flex mb-2 justify-content-between" id="betslip-card1-first">
          {isSingleBet && (
            <>
              {shouldShowMessage ? (
                <div className="w-100">
                  <div className="d-flex justify-content-between w-100">
                    <p className="event-message">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      {entry.message}
                    </p>
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="ml-auto delete-betslip"
                      onClick={() => this.removeBetById(entry.id)}
                    />
                  </div>
                  <p>{entry.event}</p>
                </div>
              ) : (
                <>
                  <p>{entry.event}</p>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="ml-auto delete-betslip"
                    onClick={() => this.removeBetById(entry.id)}
                  />
                </>
              )}
            </>
          )}
          {!isSingleBet && (
            <>
              <p>{entry.name}</p>
              <p className="mr-2 count-betslip">
                ({/* <FontAwesomeIcon icon={faTimes} className="ml-auto mr-0 count-betslip"/> */}
                <span className="ml-auto mr-0 count-betslip">x</span>
                {isSingleBet ? entry.selection : entry.count})
              </p>
            </>
          )}
        </div>
        <div className="d-flex" id="betslip-card1-match">
          <div className="d-flex total-stake">
            {!isSingleBet && (
              <>
                <p>Total Stake</p>
                <p className="mr-2 ml-2">{entry.totalStake ? entry.totalStake : ''}</p>
              </>
            )}
          </div>
          {isSingleBet ? <p className={entry.unavailable && 'unavailable-event'}>{entry.selection}</p> : <p></p>}
          <p className={entry.oddsChange === -1 ? 'odds-red' : entry.oddsChange === 1 ? 'odds-green' : 'odds-normal'}>
            {oddType.includes('Decimal') ? entry.odds : null}
            {oddType.includes('American') ? entry.oddsAmerican : null}
            {oddType.includes('Fractional') ? entry.oddsFractional : null}
          </p>
        </div>
        {entry.supportsEachWay ? (
          <div className="d-flex pl-2 pb-2">
            <div className="betslip-card1-third betslip-card1-full mr-2">
              <p>
                {entry.eachwayName} @{entry.eachwayOdds}
              </p>
              <Checkbox
                value=""
                checked={entry.enabledEachWay}
                onChange={(e) => this.switchEachWay(entry.id, e.target.checked)}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        {entry.enabledEachWay ? (
          <div className="d-flex pl-2 pb-2">
            <div className="betslip-card1-third betslip-card1-full mr-2">
              <p className="win">Total stake</p>
              <p className="win">{entry.totalStake}</p>
            </div>
          </div>
        ) : (
          <></>
        )}
        <LargeDesktop>
          {this.renderStakeWin(entry, true)}
        </LargeDesktop>
        <MediumDesktop>
          {this.renderStakeWin(entry, true)}
        </MediumDesktop>
        <SmallDesktop>
          {this.renderStakeWin(entry, false)}
        </SmallDesktop>
        <Tablet>
          {this.renderStakeWin(entry, true)}
        </Tablet>
        <Mobile>
          {this.renderStakeWin(entry, false)}
        </Mobile>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  odd: state.football.odd,
  conflicts: state.betslip.betslip_conflicts,
  single_bets: state.betslip.betslip_single_bets,
  multi_combined: state.betslip.betslip_multi_combined,
  total_stake: state.betslip.betslip_total_stake,
  total_win: state.betslip.betslip_total_win,
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BetSlipEntry));
