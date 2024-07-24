import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';

import SportService from 'services/SportService';
import Balance from 'components/balance';
import { Button, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Odds from 'components/odds';
import { faTimes, faUser, faLock, faChevronDown, faChevronUp, faCog } from '@fortawesome/free-solid-svg-icons';
import { getAssetUrl } from 'utils/EnvUtils';
import { saveFavourites, openFav, saveUserInfo, closeProfile, openProfile } from 'redux/reducers/landing';
import { setDepositClick } from 'redux/reducers/betslip';
import { login, logout } from 'redux/actions';
import { selectUserInfo } from 'redux/selectors/user';
import Env from 'utils/Env';

import classes from './header.module.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      navFlag: 'profile',
      pwdType: 'password',
      email: '',
      password: '',
      showUserProfile: false,
      arrowUserProfile: false,
      showUserWallet: false,
      showSettingOdds: false,
      arrowUserWallet: false,
      mobileShow: true,
      focusEmail: false,
      focusPassword: false,
      showPCDModal: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    window.addEventListener('message', this.receiveMessage, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.betslip_deposit_click !== this.props.betslip_deposit_click) {
      this.clickDeposit();
    }
    if (prevProps.profileFlag !== this.props.profileFlag) {
      if (this.props.profileFlag) {
        this.setState({
          show: true,
          navFlag: this.props.profileFlag,
        });
      }
    }
  }

  showModal = (e) => {
    this.props.openProfile(e);
    this.setState({
      show: !this.state.show,
      navFlag: e,
    });
    this.clickUserProfile();
  };

  hideModal = () => {
    this.props.closeProfile();
    if (this.props.betslip_deposit_click) {
      this.props.setDepositClick(false);

      return;
    }
    this.setState({ show: !this.state.show });
  };

  showProfilePage = () => {
    this.props.history.push(`/profile`);
  };

  clickDeposit = () => {
    this.props.openProfile('payment');
    this.setState({
      show: !this.state.show,
      navFlag: 'payment',
    });
    this.clickUserWallet();
  };

  showHideConfirm = () => {
    this.setState({
      pwdType: this.state.pwdType === 'input' ? 'password' : 'input',
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      username: this.state.email,
      password: this.state.password,
    };

    const { login, history } = this.props;

    login(payload)
      .then(unwrapResult)
      .catch(() => history.push('/login'));
  };

  clickLogo = () => {
    this.props.history.push('/');
  };

  clickRegister = () => {
    this.props.history.push('/register');
  };

  clickLogin = () => {
    this.props.history.push('/login');
  };

  clickCasino = () => {
    this.props.history.push('/casino');
  };

  clickUserProfile = () => {
    this.setState({ showUserProfile: !this.state.showUserProfile, arrowUserProfile: !this.state.arrowUserProfile });
    this.setState({ showUserWallet: false, arrowUserWallet: false });
  };

  clickLogOut = () => {
    this.setState({ showUserProfile: !this.state.showUserProfile, arrowUserProfile: !this.state.arrowUserProfile });
    this.props.logout();
    this.props.history.push('/login');
  };

  clickUserWallet = () => {
    this.setState({ showUserWallet: !this.state.showUserWallet, arrowUserWallet: !this.state.arrowUserWallet });
    this.setState({ showUserProfile: false, arrowUserProfile: false });
  };

  clickSettingOdds = () => {
    this.setState({ showSettingOdds: !this.state.showSettingOdds });
    this.setState({ showUserProfile: false, arrowUserProfile: false });
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // this.setState({ showUserProfile: false, arrowUserProfile: false });
      // this.setState({ showUserWallet: false, arrowUserWallet: false });
    }
  };

  getFavourites = () => {
    this.toggleFav();
    SportService.getFavourite()
      .then((res) => {
        this.props.saveFavourites(res);
      })
      .catch(() => {});
  };

  toggleFav = () => {
    this.props.history.push('/');
    this.props.openFav();
  };

  focusEmailInput = () => {
    this.setState({
      focusEmail: true,
    });
  };

  blurEmailInput = () => {
    this.setState({
      focusEmail: false,
    });
  };

  focusPasswordInput = () => {
    this.setState({
      focusPassword: true,
    });
  };

  blurPasswordInput = () => {
    this.setState({
      focusPassword: false,
    });
  };

  render() {
    const {
      history,
      socialLinks,
      userInfo: { isLoggingIn, isLoggedIn, firstName, activeBalance, currencyIso },
    } = this.props;
    const isLandingOrSport = window.location.pathname === '/' || window.location.pathname.includes('/sport');
    const isCasino = window.location.pathname.includes('/casino');
    const isRegister = window.location.pathname.includes('/register');
    const isLogin = window.location.pathname.includes('/login');

    const beforeLogin = () => {
      return (
        <div className="row ml-md-0 ml-5 mr-0 d-md-flex d-none">
          {window.location.pathname.includes('/register') ||
          window.location.pathname.includes('/login') ||
          window.location.pathname.includes('/registersuccess') ? null : (
            <>
              <form className="ml-0 header-login" onSubmit={this.handleSubmit}>
                <InputGroup className={this.state.focusEmail ? 'login-form p-0 active-border' : 'login-form p-0'}>
                  <FormControl
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    onFocus={this.focusEmailInput}
                    onBlur={this.blurEmailInput}
                    required
                  />
                  <InputGroup.Append>
                    <InputGroup.Text className={this.state.focusEmail ? 'active-span' : ''}>
                      <FontAwesomeIcon className={this.state.focusEmail ? 'active-svg' : ''} icon={faUser} />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                <InputGroup className={this.state.focusPassword ? 'login-form p-0 active-border' : 'login-form p-0'}>
                  <FormControl
                    placeholder="Password"
                    type={this.state.pwdType}
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    onFocus={this.focusPasswordInput}
                    onBlur={this.blurPasswordInput}
                    required
                  />
                  <InputGroup.Append onClick={this.showHideConfirm}>
                    <InputGroup.Text className={this.state.focusPassword ? 'active-span' : ''}>
                      <FontAwesomeIcon className={this.state.focusPassword ? 'active-svg' : ''} icon={faLock} />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                <Button id="login-btn" type="submit" className="col-md-3 col-11 ml-md-0 ml-3">
                  {isLoggingIn ? <Spinner animation="border" className="ml-3 mr-3" /> : 'LOGIN'}
                </Button>
              </form>
              <Button id="login-btn-mobile" className="ml-3 to-login-btn" onClick={() => history.push('/login')}>
                {isLoggingIn ? <Spinner animation="border" className="ml-3 mr-3" /> : 'LOGIN'}
              </Button>
            </>
          )}
          {window.location.pathname.includes('/register') || window.location.pathname.includes('/registersuccess') ? (
            <Button className="ml-md-2 ml-0" id="register-btn" onClick={() => history.push('/login')}>
              LOGIN
            </Button>
          ) : (
            <Button className="ml-md-2 ml-0" id="register-btn" onClick={() => history.push('/register')}>
              REGISTER
            </Button>
          )}
          <div className="btn-pcd mt-2 ml-2 pt-2" onClick={() => this.setState({ showPCDModal: true })}>
            PCD
          </div>
          <div className="p-relative d-block d-md-none mr-3">
            <div className="header-userinfo-header bg-transparent" onClick={this.clickSettingOdds}>
              <div className="ml-2 my-2">
                <FontAwesomeIcon icon={faCog} className="icon-setting" />
              </div>
            </div>
            {this.state.showSettingOdds ? <Odds /> : null}
          </div>
        </div>
      );
    };

    const afterLogin = () => (
      <>
        <div className="flex desktop">
          <div className="p-relative">
            <div className="p-2 header-userinfo-header" id="user-profile-header" onClick={this.clickUserProfile}>
              <div>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <p className="mr-2 ml-2">{firstName}</p>
              {!this.state.arrowUserProfile ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronUp} />
              )}
            </div>
            {this.state.showUserProfile ? (
              <div className="header-userinfo-body p-1 user-profile-body" ref={this.setWrapperRef}>
                <div className="header-userinfo-body-item p-2 mb-1" onClick={() => this.showModal('profile')}>
                  <img src={getAssetUrl('/interface/l-person-24px.svg')} className="mr-2" alt="img" />
                  <p>My Profile</p>
                </div>
                <div className="header-userinfo-body-item p-2 mb-1" onClick={() => this.showModal('history')}>
                  <img src={getAssetUrl('/interface/l-history-24px.svg')} className="mr-2" alt="img" />
                  <p>Bet History</p>
                </div>
                <div className="header-userinfo-body-item p-2 mb-1" onClick={() => this.showModal('transaction')}>
                  <img src={getAssetUrl('/interface/l-ic_transfer.svg')} className="mr-2" alt="img" />
                  <p>Transaction History</p>
                </div>
                <div className="header-userinfo-body-item p-2 mb-1" onClick={this.clickLogOut}>
                  <img src={getAssetUrl('/interface/l-ic_log_out.svg')} className="mr-2" alt="img" />
                  <p>Log Out</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="p-relative">
            <div className="p-2 header-userinfo-header" onClick={this.clickUserWallet}>
              <div>
                <img src={getAssetUrl('/interface/l-ic_wallet.svg')} alt="img" />
              </div>
              <Balance active={activeBalance} />
              {!this.state.arrowUserWallet ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronUp} />
              )}
            </div>
            {this.state.showUserWallet ? (
              <div className="header-userinfo-body p-1 user-wallet-body" ref={this.setWrapperRef}>
                <div
                  className="header-userinfo-body-item p-2 mb-1 d-flex align-items-center"
                  onClick={this.clickDeposit}
                >
                  <img src={getAssetUrl('/interface/l-ic_deposit.svg')} className="mr-2" alt="img" />
                  <p>Deposit / Withdraw</p>
                </div>
              </div>
            ) : null}
          </div>
          <div>
            {!this.props.flagFav ? (
              <div className="header-userinfo-header">
                <div onClick={this.getFavourites} className="m-2">
                  <img className="img-favorites" alt="Favorites" />
                </div>
              </div>
            ) : (
              <div className="header-userinfo-header">
                <div onClick={this.toggleFav} className="m-2">
                  <img className="img-favorites-active" alt="Active favorites" />
                </div>
              </div>
            )}
          </div>
          <div className="btn-pcd mt-2 ml-2 pt-2" onClick={() => this.setState({ showPCDModal: true })}>
            PCD
          </div>
        </div>
        <div className="flex mobile" id="after-login">
          <div className="p-relative">
            <div className="p-2 header-userinfo-header mr-2" onClick={this.showProfilePage}>
              <p className="mr-2">
                {activeBalance} {currencyIso}
              </p>
            </div>
          </div>
          <div className="p-relative">
            <div className="p-2 header-userinfo-header" id="user-profile-header" onClick={this.showProfilePage}>
              <div>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <p className="mr-2 ml-2">{firstName}</p>
            </div>
          </div>

          <div className="p-relative d-block d-md-none">
            <div className="header-userinfo-header bg-transparent" onClick={this.clickSettingOdds}>
              <div className="ml-2 my-2">
                <FontAwesomeIcon icon={faCog} className="icon-setting" />
              </div>
            </div>
            {this.state.showSettingOdds ? <Odds /> : null}
          </div>
        </div>
      </>
    );

    return (
      <div id="header" className={`${classes.header} d-flex justify-content-between m-0`}>
        <div className={`${classes.logoWrapper} d-flex align-items-center p-0 desktop`}>
          <img
            className={`${classes.logo}`}
            src="/assets/image/logo.svg"
            id="logo"
            alt="tether.bet"
            onClick={this.clickLogo}
          />
          <h1 id="site_name" className={`${classes.title}`} onClick={this.clickLogo}>
            tether.bet
          </h1>
          <h2 className={`${classes.catchPhrase}`}>the world's highest limits</h2>
        </div>
        <div className={`d-flex desktop justify-content-between ${classes.actionItems}`}>
          <div className={`${classes.socialMedia} ${isLoggedIn ? classes.loggedIn : classes.loggedOut}`}>
            <img
              src="/assets/image/follow-us/icon-facebook.svg"
              className={`${classes.socialIcon} mr-3`}
              alt="facebook icon"
              onClick={() => window.open(socialLinks.facebook, '_blank')}
            />
            <img
              src="/assets/image/follow-us/icon-twitter.svg"
              className={`${classes.socialIcon} `}
              alt="twitter icon"
              onClick={() => window.open(socialLinks.twitter, '_blank')}
            />
            <img
              src="/assets/image/follow-us/icon_instagram.svg"
              className={`${classes.socialIcon} ml-3`}
              alt="instagram icon"
              onClick={() => window.open(socialLinks.instagram, '_blank')}
            />
          </div>
          <p
            className={`link-btn px-4 d-md-block d-none ml-auto ${isLandingOrSport ? 'select-link' : ''}`}
            onClick={this.clickLogo}
          >
            Sports
          </p>
          <p className={`link-btn pr-4 d-md-block d-none ${isCasino ? 'select-link' : ''}`} onClick={this.clickCasino}>
            Casino
          </p>
          {isLoggedIn ? afterLogin() : beforeLogin()}

          <div className="p-relative d-none d-md-block">
            <div
              className={
                this.state.showSettingOdds ? 'active-userinfo header-userinfo-header' : 'header-userinfo-header'
              }
              onClick={this.clickSettingOdds}
            >
              <div className="m-2">
                <FontAwesomeIcon icon={faCog} className="icon-setting" />
              </div>
            </div>
            {this.state.showSettingOdds ? <Odds /> : null}
          </div>
        </div>
        <div className="p-0 mobile">
          <div className="d-flex mobile-header-wrap justify-content-between">
            <div className="d-flex align-items-center">
              {isRegister && (
                <Link to="/login">
                  <span className="mobile-auth d-md-none d-block">Login</span>
                </Link>
              )}
              {isLogin && (
                <span onClick={this.clickRegister} className="mobile-auth d-md-none d-block">
                  Register
                </span>
              )}
              {isRegister && <FontAwesomeIcon className="mobile-close d-md-none d-block" icon={faTimes} />}
              {isLogin && <FontAwesomeIcon className="mobile-close d-md-none d-block" icon={faTimes} />}
              {!isLogin && !isRegister && !isLoggedIn && (
                <div className="d-md-none d-block">
                  <Link to="/login">
                    <span className="mobile-auth mobile-login d-md-none d-block">Login</span>
                  </Link>
                  <div className="mobile-yellow-btn-auth" onClick={this.clickRegister}>
                    <span>Register</span>
                  </div>
                </div>
              )}
              {window.location.pathname.includes('/profile') ? (
                <FontAwesomeIcon
                  className="mobile-close d-md-none d-block"
                  icon={faTimes}
                  onClick={() => history.goBack()}
                />
              ) : !isLoggedIn ? (
                beforeLogin()
              ) : (
                afterLogin()
              )}
            </div>
          </div>
        </div>
        <Modal show={this.state.show} onHide={this.hideModal} id="setting-modal" backdrop="static">
          <Modal.Header closeButton />
          <Modal.Body>
            <iframe
              src={Env.URL + '#profile/' + this.state.navFlag}
              width="100%"
              style={{ height: '100%', border: 'none' }}
              title="profile"
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showPCDModal}
          onHide={() => this.setState({ showPCDModal: false })}
          id="third-party-modal"
          backdrop="static"
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <iframe
              src={'/private_client_desk.html'}
              width="100%"
              style={{ height: '100%', border: 'none' }}
              title="Private Cient Desk"
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  flagFav: state.landing.flagFav,
  access_token: state.landing.access_token,
  betslip_deposit_click: state.betslip.betslip_deposit_click,
  profileFlag: state.landing.profileFlag,
  socialLinks: state.landing.socialLinks,
  userInfo: selectUserInfo(state),
});

const mapDispatchToProps = {
  saveFavourites,
  openFav,
  saveUserInfo,
  setDepositClick,
  closeProfile,
  openProfile,
  login,
  logout,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
