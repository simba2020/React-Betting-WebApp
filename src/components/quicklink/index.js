import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Block from './quickLinkBlock';
import ScrollContainer from 'react-indiana-drag-scroll';

import { setCollapseQuickLink, collapseQuickLink, triggerTournament } from '../../redux/actions';

class QuickLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse_quick: this.props.collapse_quick,
      trigger_tournament: this.props.trigger_tournament,
    };
    this.blockRef = React.createRef();
    this.blockRef.current = [];
  }

  componentDidMount() {
    if (this.state.trigger_tournament.length !== 0 && !this.props.location.pathname.includes('/event/')) {
      this.clickTournament(this.state.trigger_tournament[0], this.state.trigger_tournament[1], true);
    }

    const offsetTop = localStorage.getItem('offsetTop');

    if (offsetTop !== null && window.innerWidth < 600) {
      this.moveToScroll(Number(offsetTop) - 300);
    }

    if (window.innerWidth > 768) {
      window.scrollTo(0, 0);
    }

    const data = this.props.data;
    const countryNum = Object.keys(data.items).indexOf(this.props.selectedRegionName);

    this.props.setCollapseQuickLink([Object.keys(data.items).length, countryNum]);
  }

  toggleQuickLink = (id, region) => {
    this.props.CollapseQuickLink(id);
    this.props.filterRegion(region);
    localStorage.setItem('offsetTop', this.blockRef.current[id].offsetTop);
    this.setState({});
  };

  moveToScroll = (offsetTop) => {
    window.scrollTo(0, offsetTop);
  };

  clickTournament = (id) => {
    this.props.history.push('/sport/' + id.substr(8));
  };

  render() {
    const data = this.props.data;

    return (
      <ScrollContainer>
        <div id="football-quick-link" className="pl-md-0 pr-m-2 mb-md-1  pt-0 mb-3 pl-2">
          {data.itemsPromoted.map((promote, index) => (
            <div className="quick-unit p-2 mb-2" key={index}>
              <p>{promote.name}</p>
              <p className="ml-auto">{promote.itemsCount}</p>
            </div>
          ))}
          {Object.keys(data.items).map((regionName, index) => (
            <div
              className="block-wrap"
              key={index}
              ref={(element) => {
                this.blockRef.current.push(element);
              }}
            >
              <Block
                key={index}
                regionName={regionName}
                active={regionName === this.props.selectedRegionName}
                data={data}
                id={index}
                isOpen={this.props.collapse_quick[index]}
                onToggle={() => this.toggleQuickLink(index, regionName)}
              />
            </div>
          ))}
        </div>
      </ScrollContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  collapse_quick: state.football.collapse_quick,
  trigger_tournament: state.football.trigger_tournament,
});

const mapDispatchToProps = (dispatch) => ({
  setCollapseQuickLink: (payload) => dispatch(setCollapseQuickLink(payload)),
  CollapseQuickLink: (payload) => dispatch(collapseQuickLink(payload)),
  triggerTournament: (payload) => dispatch(triggerTournament(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuickLink));
