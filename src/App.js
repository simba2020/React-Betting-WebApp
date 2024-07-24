import QuickLogin from 'components/quick-login/quick-login';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

import './App.css';

import { heartbeat } from 'redux/actions';
import { selectUserInfo } from 'redux/selectors/user';
import MessageBusService from 'services/MessageBusService';

import Env from 'utils/Env';

import {
  Login,
  Register,
  Activate,
  PasswordReset,
  RegisterSuccess,
  Static,
  PasswordRecover,
  PasswordRecoverSent,
} from 'pages';
import Landing from 'pages/landing';
import Sport from 'pages/sports';
import TournamentPage from 'pages/tournament';
import Event from 'pages/event';
import Live from 'pages/live';
import LiveEvent from 'pages/live/liveEvent';
import LiveTournament from 'pages/live/liveTournament';
import Search from 'pages/search';
import HorseRacing from 'pages/horseracing';
import HorseRacingDetail from 'pages/horseracing/detail';
import Profile from 'pages/profile';
import CasinoPage from 'pages/casino';
import Coupon from 'pages/coupon';
import CouponTournament from 'pages/coupon/coupon-tournament';

import GameNav from 'components/layout/gamenav';
import Header from 'components/layout/header';
import Footer from 'components/layout/footer';
import { PageWrapper, HeaderStyle, Content } from 'components/layout';
import History from 'components/history';
import Deposit from 'components/payment/deposit';
import Withdraw from 'components/payment/withdraw';
import TransactionHistory from 'components/transaction-history';
import Personal from 'components/profile/personal';
import Account from 'components/profile/account';
import CarouselComponent from 'components/carousel';

import BetSlipMobile from 'components/betslip/mobile';
import Message from 'components/message';
import { MobileAZSports } from 'pages/mobile-azsports';

import SubscriberService from 'services/subscriberService';
import subscriberService from 'services/subscriberService';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn, subId } = useSelector(selectUserInfo);

  useEffect(() => {
    MessageBusService.listen();
  }, []);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    dispatch(heartbeat());
  }, [dispatch]);

  useEffect(() => {
    subscriberService.initialize();

    if (isLoggedIn) {
      SubscriberService.userInitialize(subId);
    }

    return () => {
      SubscriberService.closeEventSource(subId);
    };
  }, [isLoggedIn, subId]);

  let appTitle = 'tether.bet';

  if (!!Env.ENV_TITLE) {
    appTitle = 'tether.bet | ' + Env.ENV_TITLE;
  }

  return (
    <div className="root">
      <Helmet>
        <title>{appTitle}</title>
      </Helmet>
      <Switch>
        <Route
          path={['/register', '/login']}
          render={() => (
            <>
              <Header />
              <Switch>
                <Route
                  path="/login"
                  render={() => (
                    <Content shiftHeader>
                      <Login />
                    </Content>
                  )}
                />
                <Route
                  path="/register/success"
                  render={() => (
                    <Content shiftHeader>
                      <RegisterSuccess />
                    </Content>
                  )}
                />
                <Route
                  path="/register"
                  render={() => (
                    <Content shiftHeader>
                      <Register />
                    </Content>
                  )}
                />
              </Switch>
              <Footer />
            </>
          )}
        />
        <Route
          exact
          path={`/user/activate/:token`}
          render={() => (
            <>
              <Header />
              <Content shiftHeader>
                <Activate />
              </Content>
              <Footer />
            </>
          )}
        />
        <Route
          exact
          path={`/user/password-reset/:token`}
          render={() => (
            <>
              <Header />
              <Content shiftHeader>
                <PasswordReset />
              </Content>
              <Footer />
            </>
          )}
        />
        <Route
          exact
          path={`/user/password-recover`}
          render={() => (
            <>
              <Header />
              <Content shiftHeader>
                <PasswordRecover />
              </Content>
              <Footer />
            </>
          )}
        />
        <Route
          exact
          path={`/user/password-recover/sent`}
          render={() => (
            <>
              <Header />
              <Content shiftHeader>
                <PasswordRecoverSent />
              </Content>
              <Footer />
            </>
          )}
        />
        <Route
          path="/user"
          render={({ match: { path } }) => (
            <Switch>
              <Route path={`${path}/bethistory`} component={History} />
              <Route path={`${path}/transaction-history`} component={TransactionHistory} />
              <Route path={`${path}/messages`} component={Message} />
              <Route path={`${path}/personal`} component={Personal} />
              <Route path={`${path}/account`} component={Account} />
              <Route path={`${path}/deposit`} component={Deposit} />
              <Route path={`${path}/withdraw`} component={Withdraw} />
              <Redirect to="/" />
            </Switch>
          )}
        />
        <Route
          render={() => (
            <div className="global-page">
              <Header />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => (
                    <>
                      <GameNav />
                      <CarouselComponent />
                      <PageWrapper betslip casino>
                        <Landing {...props} />
                      </PageWrapper>
                      <Footer />
                    </>
                  )}
                />
                <Route
                  path={['/mobile-betslip', '/profile']}
                  render={() => (
                    <Switch>
                      <Route path="/mobile-betslip" component={BetSlipMobile} />
                      <Route
                        path="/profile"
                        render={(props) => (
                          <PageWrapper>
                            <Profile {...props} />
                          </PageWrapper>
                        )}
                      />
                    </Switch>
                  )}
                />
                <Route
                  path="/casino"
                  render={(props) => (
                    <>
                      <CasinoPage {...props} />
                      <Footer />
                    </>
                  )}
                />
                <Route
                  path="/azsport"
                  render={(props) => (
                    <>
                      <MobileAZSports {...props} />
                      <Footer />
                    </>
                  )}
                />
                <Route
                  path="/coupon"
                  render={({ match: { path } }) => (
                    <>
                      <GameNav />
                      <Switch>
                        <Route path={`${path}/:sport/:tournament`} component={CouponTournament} />
                        <Route path={path} component={Coupon} />
                      </Switch>
                      <Footer />
                    </>
                  )}
                />
                <Route
                  path="/sport/:sport?/:tournament?"
                  render={({ match: { params } }) => (
                    <>
                      <GameNav />
                      {!params.tournament && <CarouselComponent />}
                      <PageWrapper betslip casino>
                        <Switch>
                          <Route
                            path={`/sport/:sport/:tournament`}
                            render={(props) => <TournamentPage key={props.match.params.tournament} {...props} />}
                          />
                          <Route
                            path={`/sport/:sport`}
                            render={(props) => <Sport key={props.match.params.sport} {...props} />}
                          />
                        </Switch>
                      </PageWrapper>
                      <Footer />
                    </>
                  )}
                />
                <Route
                  path={['/live', '/event', '/horseracing']}
                  render={() => (
                    <>
                      <GameNav />
                      <PageWrapper betslip casino headerStyle={HeaderStyle.TALL}>
                        <Switch>
                          <Route path="/event/:id" component={Event} />

                          <Route path="/horseracing/detail/:id" component={HorseRacingDetail} />
                          <Route path="/horseracing" component={HorseRacing} />

                          <Route path="/live/event/:id" component={LiveEvent} />
                          <Route path="/live/:sport/:tournament" component={LiveTournament} />
                          <Route path="/live" component={Live} />

                          <Redirect to="/" />
                        </Switch>
                      </PageWrapper>
                      <Footer />
                    </>
                  )}
                />
                <Route
                  render={() => (
                    <>
                      <GameNav />
                      <PageWrapper betslip casino headerStyle={HeaderStyle.TALL}>
                        <Switch>
                          <Route path="/my-profile/:flag?" component={Landing} />

                          <Route path="/search" component={Search} />

                          <Route exact path="/:slug" component={Static} />

                          <Redirect to="/" />
                        </Switch>
                      </PageWrapper>
                      <Footer />
                    </>
                  )}
                />
                <Redirect to="/" />
              </Switch>
            </div>
          )}
        />
      </Switch>
      <ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={Env.TOAST_TIMEOUT} pauseOnHover />
      <QuickLogin />
    </div>
  );
};

export default App;
