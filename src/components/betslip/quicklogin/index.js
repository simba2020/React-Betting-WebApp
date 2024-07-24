import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';
import { setQuickLogin } from 'redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ClientProfileService from 'services/ClientProfileService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class QuickLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      pwdType: 'password',
      email: '',
      password: '',
      loadingFlag: false,
      loadingPwdFlag: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.quickLogin !== this.props.quickLogin) {
      this.setState({ show: this.props.quickLogin });
    }
  }

  hideModal = () => {
    this.props.setQuickLogin(false);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loadingFlag: true });
    const payload = {
      username: this.state.email,
      password: this.state.password,
    };
    ClientProfileService.signin(payload)
      .then((res) => {
        this.setState({ loadingFlag: false });
        if (res.status !== 401 && res.status !== 406) {
          this.hideModal();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(() => {
        toast.error('Error');
      });
  };

  clickForgotPwd = () => {
    if (this.state.email === '') {
      toast.warning('Please input your email');
    } else {
      this.setState({ loadingPwdFlag: true });
      const payload = { email: this.state.email };
      ClientProfileService.forgotPassword(payload)
        .then((res) => {
          toast.success(res.data.message);
          this.setState({ loadingPwdFlag: false });
        })
        .catch(() => {});
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  showHidePwd = () => {
    this.setState({
      pwdType: this.state.pwdType === 'input' ? 'password' : 'input',
    });
  };

  render() {
    const { show, loadingFlag, loadingPwdFlag, pwdType } = this.state;

    return (
      <div>
        <Modal show={show} onHide={this.hideModal} className="quick-login" centered={true}>
          <Modal.Body>
            <div className="header d-flex flex-column">
              <div className="d-flex justify-content-between">
                <span className="login">Login</span>
                <FontAwesomeIcon icon={faTimes} onClick={this.hideModal} />
              </div>
              <div className="mt-3">
                <span className="description">
                  if you don't have account{' '}
                  <a className="register" href="/register">
                    Register
                  </a>
                </span>
              </div>
            </div>
            <form className="mt-5" onSubmit={this.handleSubmit}>
              <div className="email">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  placeholder="Your email"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="password mt-4">
                <label htmlFor="password">Password</label>
                <InputGroup>
                  <FormControl
                    placeholder="Type Password"
                    type={pwdType}
                    name="password"
                    onChange={this.handleChange}
                    required
                  />
                  <InputGroup.Append onClick={this.showHidePwd}>
                    <InputGroup.Text>
                      {pwdType === 'input' ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </div>
              <div className="d-flex flex-column w-100 mt-5">
                <Button type="submit" variant="warning" className="mt-4 btn-login">
                  LOGIN
                  {loadingFlag === true ? <Spinner animation="border" className="ml-3" /> : ''}
                </Button>
                <Button variant="warning" className="mt-3 btn-recover" onClick={this.clickForgotPwd}>
                  Recover Password
                  {loadingPwdFlag === true ? <Spinner animation="border" className="ml-3" /> : ''}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  quickLogin: state.betslip.betslip_quicklogin,
});

const mapDispatchToProps = (dispatch) => ({
  setQuickLogin: (payload) => dispatch(setQuickLogin(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickLogin);
