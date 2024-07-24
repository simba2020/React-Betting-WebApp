import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Market from 'components/sportsbook/market';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

class MarketGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarkets: [],
      onlyDefaults: true,
      columns: 3,
      selected: null,
      locked: false,
      opened: true,
      coupon: false,
    };
  }

  componentDidMount() {
    const group = this.props.group;
    const onlyDefaults = this.props.onlyDefaults !== undefined && this.props.onlyDefaults === true;
    const selected = this.props.selected;
    const name = group.name;
    let columns = 3;
    let locked = false;
    let selectedMarkets = [];
    if (onlyDefaults) {
      for (let i = 0; i < Object.keys(group).length; i++) {
        if (Object.keys(group)[i] === selected) {
          const selectedGroup = Object.values(group)[i];
          selectedMarkets = selectedGroup.markets;
          locked = selectedGroup.locked;
          columns = selectedGroup.columns;
        }
      }
    } else {
      selectedMarkets = group.markets;
      columns = group.columns;
      locked = group.locked;
    }

    if (onlyDefaults) {
      const defaultMarkets = [];
      for (let i = 0; i < selectedMarkets.length; i++) {
        if (selectedMarkets[i].default === true) {
          defaultMarkets.push(selectedMarkets[i]);
        }
      }

      selectedMarkets = defaultMarkets;
    }

    this.setState({
      selectedMarkets: selectedMarkets,
      name: name,
      onlyDefaults: onlyDefaults,
      columns: columns,
      selected: selected,
      locked: locked,
      coupon: this.props.location.pathname.includes('/coupon'),
    });
  }

  render() {
    const { isPromotion, mobile } = this.props;
    const className = !this.state.onlyDefaults
      ? this.state.coupon
        ? `match-result-body mx-0 d-flex ${mobile ? 'flex-wrap' : ''}` +
        (this.state.locked ? ' locked-marketgroup' : '')
        : 'match-result-body pl-2 pb-2 row mx-0' + (this.state.locked ? ' locked-marketgroup' : '')
      : 'row ml-0 mr-0' + (this.state.locked ? ' locked-marketgroup' : '');
    const positionRelative =
      'market-group' + this.state.locked
        ? this.state.coupon && !this.props.mobile
          ? 'd-flex justify-content-center position-relative mt-auto mb-auto'
          : 'position-relative mt-auto mb-auto'
        : '';
    const showMarkets = this.state.coupon ? 'mr-auto ml-auto' : '';

    const body = (
      <div className={positionRelative}>
        <div className={`${className}`}>
          {this.state.selectedMarkets.length !== 0 ? (
            this.state.selectedMarkets.map((market, index) => (
              <Market
                coupon={this.state.coupon}
                eventId={this.props.eventId}
                isPromotion={isPromotion}
                odds={market}
                inRow={this.state.columns}
                useDefaults={this.state.onlyDefaults}
                title={market.name}
                index={index}
                key={index}
                mobile={this.props.mobile || false}
                defaultParity={this.state.coupon && market.c === 's'}
              />
            ))
          ) : (
            <div
              className={`${showMarkets} check-other align-items-center justify-content-center`}
              onClick={() =>
                this.props.history.push({
                  pathname: '/event/' + this.props.eventId,
                })
              }
            >
              <p>View more</p>
            </div>
          )}
        </div>
        {this.state.locked && <FontAwesomeIcon icon={faLock} className="locked-icon" />}
      </div>
    );

    const header = !this.state.onlyDefaults && !this.state.coupon && (
      <div
        className="match-result-header p-2 d-flex mb-1 align-items-center justify-content-between"
        onClick={() => this.setState({ opened: !this.state.opened })}
      >
        <p className="ml-2 mb-0">{this.state.name}</p>
        <FontAwesomeIcon icon={this.state.opened ? faChevronUp : faChevronDown} className="text-white" />
      </div>
    );

    return this.state.onlyDefaults ? (
      <> {body} </>
    ) : (
      <div className={this.state.coupon ? 'w-100' : 'mb-2'}>
        {header}
        {this.state.opened && body}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  odd: state.football.odd,
});

export default withRouter(connect(mapStateToProps, null)(MarketGroup));
