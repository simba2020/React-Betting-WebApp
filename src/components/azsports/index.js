import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { closeQuickLink } from 'redux/actions';
import { Scrollbars } from 'react-custom-scrollbars';
import { getAssetUrl } from 'utils/EnvUtils';

class AZSports extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.props.changeHoverFlag(event);
    }
  };

  clickAzSport = (sport) => {
    if (sport === 'horseracing') {
      this.props.history.push('/' + sport);
    } else {
      this.props.history.push('/sport/' + sport);
    }

    this.props.closeQuickLink();
    this.props.changeHoverFlag();
  };

  clickCasino = () => {
    this.props.changeHoverFlag();
    this.props.history.push('/casino');
  };

  render() {
    const mapSports = (curr) => {
      return (
        <div className="p-3 mt-2 az-sport-click" onClick={() => this.clickAzSport(lists[curr].canonicalName)}>
          <img src={getAssetUrl(lists[curr].asset.path)} alt="img" />
          <p className="mt-0 ml-2">{lists[curr].name}</p>
          <p className="mt-0 ml-auto">{lists[curr].itemsCount}</p>
        </div>
      );
    };

    const renderLabel = (curr, prev) => {
      if (prev === undefined) {
        prev = '';
      }
      if (curr.charAt(0) !== prev.charAt(0)) {
        return <p className="col-2 d-md-block d-none pt-2">{curr.charAt(0).toUpperCase()}</p>;
      }

      return <p className="col-2 d-md-block d-none"></p>;
    };

    const lists = Object.keys(this.props.lists)
      .sort()
      .reduce((obj, key) => {
        obj[key] = this.props.lists[key];

        return obj;
      }, {});

    return (
      <div>
        <div id="triangle-up" style={{ display: this.props.hoverFlag ? 'block' : 'none' }}></div>
        <div
          style={{ display: this.props.hoverFlag ? 'block' : 'none' }}
          id="az-sport"
          className="p-lg-4 p-2"
          ref={this.wrapperRef}
        >
          <div className="casino-wrap row d-md-none d-flex">
            <div className="col-12 text-center align-items-center cursor" onClick={this.clickCasino}>
              <img src={window.location.origin + '/assets/image/footer/Ic_Casino.svg'} alt="img" />
              <p className="mt-2">Casino</p>
            </div>
          </div>
          <Scrollbars className="custom-scroll">
            <div id="az-container">
              {Object.keys(lists).map((key, index) => (
                <div className="col-xl-3 col-md-6 col-12 row az-sport-unit pl-0 pr-0" key={index}>
                  {renderLabel(Object.keys(lists)[index], Object.keys(lists)[index - 1])}
                  <div className="col-md-10 col-12 p-0 pr-md-0 pr-0">{mapSports(key)}</div>
                </div>
              ))}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  closeQuickLink: () => dispatch(closeQuickLink()),
});

export default withRouter(connect(null, mapDispatchToProps)(AZSports));
