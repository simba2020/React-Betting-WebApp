import React from 'react';
import { DebounceInput } from 'react-debounce-input';

const StakeWinInput = (props) => {

  const { entry, debounceInputFocused, overflowedMaxStake, isSingleBet, singleRow } = props;

  const stakeWinInputClass = singleRow ? "d-flex pl-2 pr-2 pb-2" : "d-flex flex-column pl-2 pr-2 pb-2";
  const debounceInputClass =
    `betslip-card1-third ${singleRow ? 'w-50' : 'w-100'} ${debounceInputFocused ? 'betslip-stake-active' : ''}`;
  const winTextClass =
    `betslip-card1-third betslip-win ${singleRow ? 'w-50 ml-2' : 'w-100 mt-2'}`

  return (
    <div className={stakeWinInputClass}>
      <div className={debounceInputClass}>
        <DebounceInput
          type="number"
          debounceTimeout={500}
          className="form-control betslip-stake"
          value={overflowedMaxStake ? entry.maxStake : entry.stake}
          onChange={props.handleStakeChange}
          onFocus={props.focusStakeInput}
          onBlur={props.blurStakeInput}
          id="stake-input"
          placeholder="Stake"
        />
      </div>
      <div className={winTextClass}>
        <p className="win">Win</p>
        <p className="win">{isSingleBet ? entry.win : entry.totalWin}</p>
      </div>
    </div>
  )
}

export { StakeWinInput };
