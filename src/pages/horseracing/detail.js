import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import QuickLink from './QuickLink';

import SportService from 'services/SportService';

import Market from 'components/sportsbook/market';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'semantic-ui-react';
import { getAssetUrl } from 'utils/EnvUtils';
import { JumpingDots } from 'components/jumping-dots';

class HorseRacingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bet_counts: 0,
      active_tab: 'racecard',
      show_detail: false,
      detail_index: -1,
      loading_link: true,
      loading_event: true,
      links: this.props.horseQuicklink,
      event: null,
      id: null,
      page404: false,
    };
  }

  componentDidMount() {
    const id = window.location.pathname.substr(20);
    this.setState({ id });
    SportService.getHorseQuickLinks()
      .then((res) => {
        this.setState({
          links: res.data,
          loading_link: false,
        });
      })
      .catch(() => {});
    this.getEvent(id);
  }

  componentDidUpdate(prevProps) {
    if (this.state.id !== this.props.match.params.id) {
      this.setState({ id: this.props.match.params.id });
      this.getEvent(this.props.match.params.id);
    }
  }

  getEvent = (id) => {
    SportService.getEvent(id)
      .then((res) => {
        if (res.data.data !== null) {
          this.setState({
            event: res.data,
            loading_event: false,
            page404: false,
          });
        } else {
          this.setState({ page404: true });
        }
      })
      .catch(() => {});
  };

  handleCheck = (index, race) => {
    const persons = Object.assign([], this.state.persons);
    let bet_counts = this.state.bet_counts;
    if (!this.state.persons[index].races[race]) bet_counts++;
    else bet_counts--;
    persons[index].races[race] = !this.state.persons[index].races[race];
    this.setState({ persons: persons, bet_counts: bet_counts });
  };

  clickItem = (item) => {
    this.setState({ active_tab: item });
  };

  showDetail = (index) => {
    if (index === this.state.detail_index) this.setState({ detail_index: -1, show_detail: false });
    else this.setState({ detail_index: index, show_detail: true });
  };

  render() {
    if (this.state.links === null) {
      if (this.state.loading_link) {
        return <JumpingDots />;
      }
    }

    const { bet_counts, active_tab, show_detail, detail_index, links, event, page404, loading_event } = this.state;
    const eventId = window.location.pathname.substr(20);

    return (
      <div>
        <div className="mobile">
          <div className="d-flex p-0 pt-1 ml-0 mr-0 row pt-112">
            <div className="col-12 m-0 p-0">
              {this.state.loading_event && !page404 ? (
                <JumpingDots />
              ) : page404 ? (
                <div className="not-found-page horse-racing-detail-not-found-height col-12">
                  <img src={window.location.origin + '/assets/image/oops.svg'} alt="img" />
                  <p>Oops!</p>
                  <p>Something went wrong - Please try again</p>
                </div>
              ) : (
                <div className="horse-race-detail">
                  <div id="inplay-header" className="p-2 d-flex mb-1 justify-content-bewteen align-items-center">
                    <div className="d-flex">
                      <FontAwesomeIcon icon={faChevronLeft} className="ml-2 mr-2" />
                      <p className="m-0" onClick={() => this.props.history.goBack()}>
                        Ascot 3: 20
                      </p>
                    </div>
                    {/* <p className="m-0">{`${event.distance} (${event.yards})`}</p> */}
                  </div>
                  {/* <div className="horse-group-wrap">
                      <div className={active_tab === "racecard" ? "horse-group-unit p-2 horse-group-active" : "horse-group-unit p-2"} onClick={() => this.clickItem("racecard")}>
                        Racecard
                      </div>
                      <div className={active_tab === "combination" ? "horse-group-unit p-2 horse-group-active" : "horse-group-unit p-2"} onClick={() => this.clickItem("combination")}>
                        Combinations
                      </div>
                    </div> */}
                  {active_tab === 'racecard' ? (
                    <Table className="racers">
                      <Table.Header className="racers-header">
                        <Table.Row>
                          <Table.HeaderCell className="first-column">
                            <div>(Draw)</div>
                            <div>No</div>
                          </Table.HeaderCell>
                          <Table.HeaderCell className="p-2">Silks</Table.HeaderCell>
                          <Table.HeaderCell>
                            <div>Horse</div>
                            <div>Form</div>
                          </Table.HeaderCell>
                          <Table.HeaderCell>Win</Table.HeaderCell>
                          <Table.HeaderCell>Place</Table.HeaderCell>
                          <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      {/* <div className="p-2"> */}
                      {Object.keys(event.horseData).map((person, index) => {
                        return person !== 'id' && person !== 'isLive' && person !== 'itemPath' ? (
                          <>
                            <Table.Body className="section p-2" key={index}>
                              <Table.Row className="table-row">
                                <Table.Cell className="first-column">
                                  <div>{index + 1}</div>
                                </Table.Cell>
                                <Table.Cell className="p-2">
                                  <img src={getAssetUrl(event.horseData[person].stat.slk)} alt="" />
                                </Table.Cell>
                                <Table.Cell>
                                  <div>{event.horseData[person].win.name}</div>
                                  <div>{event.horseData[person].stat.frm?.replace(/-/g, '').replace(/ /g, '')}</div>
                                </Table.Cell>
                                <Table.Cell>
                                  <Market
                                    eventId={eventId}
                                    odds={event.horseData[person].win}
                                    inRow={1}
                                    useDefaults={true}
                                    title={event.horseData[person].win.name}
                                    index={index}
                                    key={event.horseData[person].win.id}
                                  />
                                </Table.Cell>
                                <Table.Cell>
                                  {event.horseData[person].place && (
                                    <Market
                                      eventId={eventId}
                                      odds={event.horseData[person].place}
                                      inRow={1}
                                      useDefaults={true}
                                      title={event.horseData[person].place.name}
                                      index={index}
                                      key={event.horseData[person].place.id}
                                    />
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="ml-2 mr-2"
                                    onClick={() => this.showDetail(index)}
                                  />
                                </Table.Cell>
                              </Table.Row>
                            </Table.Body>
                            {show_detail && detail_index === index && (
                              <Table.Body className="detail-box" key={event.horseData[person].win.id}>
                                <Table.Row>
                                  <Table.Cell colSpan="3">Age</Table.Cell>
                                  <Table.Cell colSpan="3" className="color-white">
                                    {event.horseData[person].stat.age}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell colSpan="3">Jockey</Table.Cell>
                                  <Table.Cell colSpan="3" className="color-white">
                                    {event.horseData[person].stat.jck}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell colSpan="3">Tranier</Table.Cell>
                                  <Table.Cell colSpan="3" className="color-white">
                                    {event.horseData[person].stat.trnr}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell colSpan="3">OR / Wgt</Table.Cell>
                                  <Table.Cell colSpan="3" className="color-white">
                                    / {event.horseData[person].stat.weight}
                                  </Table.Cell>
                                </Table.Row>
                              </Table.Body>
                            )}
                          </>
                        ) : null;
                      })}
                    </Table>
                  ) : (
                    <Table className="racers">
                      <Table.Header className="racers-header">
                        <Table.Row>
                          <Table.HeaderCell className="first-column">
                            <div>(Draw)</div>
                            <div>No</div>
                          </Table.HeaderCell>
                          <Table.HeaderCell>
                            <div>Horse</div>
                            <div>Form</div>
                          </Table.HeaderCell>
                          <Table.HeaderCell>1st</Table.HeaderCell>
                          <Table.HeaderCell>2st</Table.HeaderCell>
                          <Table.HeaderCell>3rd</Table.HeaderCell>
                          <Table.HeaderCell>4th</Table.HeaderCell>
                          <Table.HeaderCell>Any</Table.HeaderCell>
                          <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      {Object.keys(event.horseData).map((person, index) => {
                        return person !== 'id' && person !== 'isLive' && person !== 'itemPath' ? (
                          <>
                            <Table.Body className="section p-2" key={index}>
                              <Table.Row className="table-row">
                                <Table.Cell className="first-column">
                                  {/* <div>({person.draw})</div> */}
                                  <div>{index + 1}</div>
                                </Table.Cell>
                                <Table.Cell>
                                  <div>{event.horseData[person].win.name}</div>
                                  <div>{event.horseData[person].stat.frm?.replace(/-/g, '').replace(/ /g, '')}</div>
                                </Table.Cell>
                                <Table.Cell>
                                  {/* <CustomRaceCheckBox show={person.races[0]} handleCheck={() => this.handleCheck(index, 0)} /> */}
                                </Table.Cell>
                                <Table.Cell>
                                  {/* <CustomRaceCheckBox show={person.races[1]} handleCheck={() => this.handleCheck(index, 1)} /> */}
                                </Table.Cell>
                                <Table.Cell>
                                  {/* <CustomRaceCheckBox show={person.races[2]} handleCheck={() => this.handleCheck(index, 2)} /> */}
                                </Table.Cell>
                                <Table.Cell>
                                  {/* <CustomRaceCheckBox show={person.races[3]} handleCheck={() => this.handleCheck(index, 3)} /> */}
                                </Table.Cell>
                                <Table.Cell>
                                  {/* <CustomRaceCheckBox show={person.races[4]} handleCheck={() => this.handleCheck(index, 4)} /> */}
                                </Table.Cell>
                                <Table.Cell>
                                  <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="ml-2 mr-2"
                                    onClick={() => this.showDetail(index)}
                                  />
                                </Table.Cell>
                              </Table.Row>
                            </Table.Body>
                            {show_detail && detail_index === index && (
                              <Table.Body className="detail-box" key={event.horseData[person].win.id}>
                                <Table.Row>
                                  <Table.Cell colSpan="4">Age</Table.Cell>
                                  <Table.Cell colSpan="4" className="color-white">
                                    {event.horseData[person].stat.age}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell colSpan="4">Jockey</Table.Cell>
                                  <Table.Cell colSpan="4" className="color-white">
                                    {event.horseData[person].stat.jck}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell colSpan="4">Tranier</Table.Cell>
                                  <Table.Cell colSpan="4" className="color-white">
                                    {event.horseData[person].stat.trnr}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell colSpan="4">OR / Wgt</Table.Cell>
                                  <Table.Cell colSpan="4" className="color-white">
                                    {/* {person.or}/  */}/ {event.horseData[person].stat.weight}
                                  </Table.Cell>
                                </Table.Row>
                              </Table.Body>
                            )}
                          </>
                        ) : null;
                      })}
                    </Table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="desktop">
          <div className="d-flex pr-2 ml-0 mr-0 row pt-112">
            <div className="col-12">
              <div className="row">
                <div className="col-md-3 col-12 pr-0 pl-0">
                  <QuickLink links={links} />
                </div>
                <div className="col-md-9 col-12 pl-2 pr-0">
                  {loading_event && !page404 ? (
                    <JumpingDots />
                  ) : page404 ? (
                    <div className="not-found-page horse-racing-detail-not-found-height">
                      <img src={window.location.origin + '/assets/image/oops.svg'} alt="img" />
                      <p>Oops!</p>
                      <p>Something went wrong - Please try again</p>
                    </div>
                  ) : (
                    <div>
                      <div id="inplay-header" className="p-2 d-flex mb-2 justify-content-bewteen align-items-center">
                        <div className="d-flex">
                          <FontAwesomeIcon icon={faChevronLeft} className="ml-2 mt-1 mr-2" />
                          <p className="mt-1 mb-0" onClick={() => this.props.history.goBack()}>
                            {event.tournamentName} {new Date().toTimeString().slice(0, 5)}
                          </p>
                        </div>
                        {/* <p className="mt-1 mb-0 mr-2">{`${event.distance} (${event.yards})`}</p> */}
                      </div>
                      <Table className="racers">
                        <Table.Header className="racers-header">
                          <Table.Row>
                            <Table.HeaderCell className="first-column">
                              <div>(Draw)</div>
                              <div>No</div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Silks</Table.HeaderCell>
                            <Table.HeaderCell>
                              <div>Name</div>
                              <div>Form</div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                              <div className="ml-4">Jockey</div>
                              <div className="ml-4">Trainer</div>
                            </Table.HeaderCell>
                            <Table.HeaderCell className="text-center">
                              <div>Age</div>
                              <div>OR / Weight</div>
                            </Table.HeaderCell>
                            <Table.HeaderCell className="text-center">
                              <span>Win</span>
                            </Table.HeaderCell>
                            <Table.HeaderCell className="text-center">Place</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        {/* <div className="p-2"> */}
                        {Object.keys(event.horseData).map((person, index) => {
                          return person !== 'id' && person !== 'isLive' && person !== 'itemPath' ? (
                            <Table.Body className="section p-2" key={index}>
                              <Table.Row className="table-row">
                                <Table.Cell className="first-column w-5">
                                  <div>{index + 1}</div>
                                </Table.Cell>
                                <Table.Cell className="w-10">
                                  <img src={getAssetUrl(event.horseData[person].stat.slk)} alt="" />
                                </Table.Cell>
                                <Table.Cell className="w-25">
                                  <div>{event.horseData[person].win.name}</div>
                                  <div>{event.horseData[person].stat.frm?.replace(/-/g, '').replace(/ /g, '')}</div>
                                </Table.Cell>
                                <Table.Cell className="w-20">
                                  <div className="ml-3">{event.horseData[person].stat.jck}</div>
                                  <div className="ml-3">{event.horseData[person].stat.trnr}</div>
                                </Table.Cell>
                                <Table.Cell className="w-20 text-center">
                                  <div>{event.horseData[person].stat.age}</div>
                                  <div>
                                    <div>/ {event.horseData[person].stat.weight}</div>
                                  </div>
                                </Table.Cell>
                                <Table.Cell className="w-10">
                                  <Market
                                    eventId={eventId}
                                    odds={event.horseData[person].win}
                                    inRow={1}
                                    useDefaults={true}
                                    title={event.horseData[person].win.name}
                                    index={index}
                                    key={event.horseData[person].win.id}
                                  />
                                </Table.Cell>
                                <Table.Cell className="w-10">
                                  {event.horseData[person].place && (
                                    <Market
                                      eventId={eventId}
                                      odds={event.horseData[person].place}
                                      inRow={1}
                                      useDefaults={true}
                                      title={event.horseData[person].place.name}
                                      index={index}
                                      key={event.horseData[person].place.id}
                                    />
                                  )}
                                </Table.Cell>
                                <Table.Cell></Table.Cell>
                                {/* <Table.Cell><CustomRaceCheckBox show={person.races[0]} handleCheck={() => this.handleCheck(index, 0)} /></Table.Cell>
                                    <Table.Cell><CustomRaceCheckBox show={person.races[1]} handleCheck={() => this.handleCheck(index, 1)} /></Table.Cell>
                                    <Table.Cell><CustomRaceCheckBox show={person.races[2]} handleCheck={() => this.handleCheck(index, 2)} /></Table.Cell>
                                    <Table.Cell><CustomRaceCheckBox show={person.races[3]} handleCheck={() => this.handleCheck(index, 3)} /></Table.Cell>
                                    <Table.Cell><CustomRaceCheckBox show={person.races[4]} handleCheck={() => this.handleCheck(index, 4)} /></Table.Cell> */}
                              </Table.Row>
                            </Table.Body>
                          ) : null;
                        })}
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {bet_counts > 0 && (
          <div className="bet-slip-btn">
            <div>Add To BetSlip</div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  horseQuicklink: state.football.horseQuicklink,
});

export default withRouter(connect(mapStateToProps, null)(HorseRacingDetail));
