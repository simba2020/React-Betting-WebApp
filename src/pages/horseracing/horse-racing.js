import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { QuickLinks } from 'components/horse-racing';
import { fetchHorseRacingUpcomingEvents } from 'redux/actions/horse-racing';
import { selectFetchingUpcomingEvents } from 'redux/selectors/horse-racing';

import classes from './horse-racing.module.scss';

const HorseRacing = () => {
  const dispatch = useDispatch();

  const isFetchingQuickLinks = useSelector(selectFetchingUpcomingEvents);
  // const quickLinks = useSelector(selectFetchingUpcomingEvents);

  useEffect(() => {
    dispatch(fetchHorseRacingUpcomingEvents());
  }, [dispatch]);

  return (
    <div className={classes.horseRacingPage}>
      <div className={classes.leftPane}>
        <QuickLinks loading={isFetchingQuickLinks} links />
      </div>
      <div className={classes.rightPane}>right</div>
    </div>
  );
};

// class HorseRacing extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       links: null,
//       ranks: null,
//       groups: null,
//       loading_link: true,
//       loading_rank: false,
//       loading_group: false,
//       collapse_horsegroup: this.props.collapse_horsegroup,
//       date: 'today',
//       groupKeys: [],
//       countryGroup: [],
//     };
//   }
//
//   componentDidMount() {
//     SportService.getHorseQuickLinks()
//       .then((res) => {
//         this.props.saveHorseQuickLinks(res.data);
//         this.setState({ links: res.data, loading_link: false });
//       })
//       .catch((err) => {});
//
// SportService.getHorseNextEvents()
//   .then((res) => {
//     this.setState({ ranks: res.data, loading_rank: false });
//   })
//   .catch(() => {});
//
// SportService.getHorseEventGroup()
//   .then((res) => {
//     this.props.setHorseGroupCollapse(Object.keys(res.data).length);
//     const groupKeys = [];
//     for (let i = 0; i < Object.keys(res.data).length; i++) {
//       let countryKey = Object.keys(res.data)[i];
//       for (let j = 0; j < Object.keys(res.data[countryKey].items).length; j++) {
//         groupKeys.push(Object.keys(res.data[countryKey].items)[j]);
//       }
//     }
//     const countryGroup = {};
//     for (let i = 0; i < Object.keys(res.data).length; i++) {
//       let countryKey = Object.keys(res.data)[i];
//       let venues = [];
//       for (let j = 0; j < Object.keys(res.data[countryKey].items).length; j++) {
//         venues.push(Object.keys(res.data[countryKey].items)[j]);
//       }
//       countryGroup[countryKey] = venues;
//     }
//     this.setState({ groups: res.data, groupKeys, countryGroup, loading_group: false });
//   })
//   .catch(() => {});
// }
//
// goToDetail = (id) => {
//   window.scrollTo(0, 0);
//   this.props.history.push(`/horseracing/detail/${id}`);
// };
//
// toggleHorseGroup = (id) => {
//   this.props.CollapseHorseGroup(id);
//   this.setState({});
// };
//
// render() {
//   if (this.state.loading_rank /* || this.state.loading_link || this.state.loading_group*/) {
//     return <JumpingDots />;
//   }
//
//   const ranking_units = this.state.ranks;
//   const groups = this.state.groups;
//
//   const renderGroup = (groups) => {
//     return Object.keys(groups).map((item, index) => {
//       return (
//         <div className="horse-tournament pt-3" key={index} ref={'venue_' + groups[item].canonicalName}>
//           <p className="ml-3">{groups[item].name}</p>
//           <div className="country-unit-body p-3 row mr-0 ml-0" ref={'group_' + groups[item].canonicalName}>
//             {renderItems(groups[item].items)}
//           </div>
//         </div>
//       );
//     });
//   };
//
//   const renderGroupMobile = (groups) => {
//     return Object.keys(groups).map((item, index) => {
//       return (
//         <div className="horse-tournament pt-3" key={index} ref={'venue_mobile_' + groups[item].canonicalName}>
//           <p className="ml-3">{groups[item].name}</p>
//           <div className="country-unit-body p-3 row mr-0 ml-0" ref={'group_mobile_' + groups[item].canonicalName}>
//             {renderItems(groups[item].items)}
//           </div>
//         </div>
//       );
//     });
//   };
//
//   const renderItems = (items) => {
//     return items.map((item, index) => {
//       if (this.state.date === 'today') {
//         return new Date(item.starts * 1e3).getDate() === new Date().getDate() ? (
//           <RacingIcon
//             data={new Date(item.starts * 1e3).toTimeString().slice(0, 5)}
//             id={item.id}
//             goToDetail={this.goToDetail}
//             key={index}
//           />
//         ) : null;
//       } else if (this.state.date === 'tomorrow') {
//         return new Date(item.starts * 1e3).getDate() - new Date().getDate() === 1 ? (
//           <RacingIcon
//             data={new Date(item.starts * 1e3).toTimeString().slice(0, 5)}
//             id={item.id}
//             goToDetail={this.goToDetail}
//             key={index}
//           />
//         ) : null;
//       } else {
//         return null;
//       }
//     });
//   };
//
//   return (
//     <div>
//       <div className="d-flex ml-0 mr-0 row pt-112">
//         <div className="col-12 desktop">
//           <div className="row ml-md-0">
//             <div className="col-md-20 col-12 pr-0 pl-0">
//               <QuickLink links={this.state.links} />
//             </div>
//             <div className="col-md-80 col-12 pl-md-2 pl-0 pr-0">
//               <div className="row mr-0 ml-0">
//                 {ranking_units.map((ranking_unit, index) => (
//                   <div className="col-md-4 p-0" key={index}>
//                     <div className="ranking-unit pl-2 pt-2 pb-2 mr-2">
//                       <RankingUnit ranking_unit={ranking_unit} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-2 pr-2">
//                 <div id="horse-navbar" className="row ml-0 mr-0 mb-2">
//                   <div
//                     className={
//                       this.state.date === 'today'
//                         ? 'col-2 horse-navbar-nav game-nav-active'
//                         : 'col-2 horse-navbar-nav'
//                     }
//                     onClick={() => this.setState({ date: 'today' })}
//                   >
//                     <p>Today</p>
//                   </div>
//                   <div
//                     className={
//                       this.state.date === 'tomorrow'
//                         ? 'col-2 horse-navbar-nav game-nav-active'
//                         : 'col-2 horse-navbar-nav'
//                     }
//                     onClick={() => this.setState({ date: 'tomorrow' })}
//                   >
//                     <p>Tomorrow</p>
//                   </div>
//                 </div>
//                 <div>
//                   {Object.keys(groups).map((group, index) => (
//                     <div key={index} ref={'country_' + groups[group].canonicalName}>
//                       <Block
//                         countryName={groups[group].name}
//                         refName={groups[group].canonicalName}
//                         groupKeys={this.state.groupKeys}
//                         isOpen={this.state.collapse_horsegroup[index]}
//                         onToggle={() => this.toggleHorseGroup(index)}
//                         id={index}
//                       >
//                         {renderGroup(groups[group].items)}
//                       </Block>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="mobile horserace-container col-12 m-md-0 p-0">
//           <div className="ranking-units mb-2 mt-2">
//             {ranking_units.map((ranking_unit, index) => (
//               <div className="ranking-unit" key={index}>
//                 <RankingUnit ranking_unit={ranking_unit} />
//               </div>
//             ))}
//           </div>
//           <div id="horse-navbar" className="row ml-0 mr-0 mb-2">
//             <div
//               className={
//                 this.state.date === 'today' ? 'col-6 horse-navbar-nav game-nav-active' : 'col-6 horse-navbar-nav'
//               }
//               onClick={() => this.setState({ date: 'today' })}
//             >
//               <p>Today</p>
//             </div>
//             <div
//               className={
//                 this.state.date === 'tomorrow' ? 'col-6 horse-navbar-nav game-nav-active' : 'col-6 horse-navbar-nav'
//               }
//               onClick={() => this.setState({ date: 'tomorrow' })}
//             >
//               <p>Tomorrow</p>
//             </div>
//           </div>
//           <div>
//             {Object.keys(groups).map((group, index) => (
//               <div key={index} ref={'country_mobile_' + groups[group].canonicalName}>
//                 <Block
//                   countryName={groups[group].name}
//                   refName={groups[group].canonicalName}
//                   groupKeys={this.state.groupKeys}
//                   isOpen={this.state.collapse_horsegroup[index]}
//                   onToggle={() => this.toggleHorseGroup(index)}
//                   id={index}
//                 >
//                   {renderGroupMobile(groups[group].items)}
//                 </Block>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// }
//
// const mapStateToProps = (state) => ({
//   collapse_horsegroup: state.football.collapse_horsegroup,
// });
//
// const mapDispatchToProps = (dispatch) => ({
//   setHorseGroupCollapse: (payload) => dispatch(setHorseGroupCollapse(payload)),
//   CollapseHorseGroup: (payload) => dispatch(collapseHorseGroup(payload)),
//   saveHorseQuickLinks: (payload) => dispatch(saveHorseQuickLinks(payload)),
// });
//
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HorseRacing));

export default HorseRacing;
