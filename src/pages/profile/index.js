import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { logout as logoutAction } from 'redux/actions';
import { selectUserInfo } from 'redux/selectors/user';
import { getAssetUrl } from 'utils/EnvUtils';

const Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { firstName, accessToken, activeBalance, currencyIso } = useSelector(selectUserInfo);

  const [arrowUserProfile, udpateArrow] = useState(true);

  const clickPersonalDetails = () => {
    history.push('user/personal');
  };

  const changePassword = () => {
    history.push(`/user/password-reset/${accessToken}`);
  };

  const clickBetHistory = () => {
    history.push('/user/bethistory');
  };

  const verifyAccount = () => {
    history.push('/user/account');
  };

  const logout = () => {
    dispatch(logoutAction());
    history.push('/login');
  };

  const deposit = () => {
    history.push('/user/deposit');
  };

  const withdraw = () => {
    history.push('/user/withdraw');
  };

  const clickTransactionHistory = () => {
    history.push('/user/transaction-history');
  };

  return (
    <div className="pt-48 mobile-user-profile">
      <div className="flex mobile-user-header justify-content-between">
        <div className="flex align-items-center">
          <FontAwesomeIcon icon={faUserCircle} className="font-24" />
          <p className="ml-2">{firstName}</p>
        </div>
        <div className="flex align-items-center">
          <p className="mr-2 color-green">Verified</p>
          <img alt="Verify" src="/assets/image/Ic_verified.svg" />
        </div>
      </div>

      <div className="mobile-user-header">
        <div className="flex align-items-center justify-content-between">
          <div>Total Balance</div>
          <div>
            {activeBalance} {currencyIso}
          </div>
        </div>
        <div className="flex align-items-center justify-content-between mt-2">
          <div className="profile-btn deposit" onClick={deposit}>
            DEPOSIT
          </div>
          <div className="profile-btn" onClick={withdraw}>
            WITHDRAW
          </div>
        </div>
      </div>

      <div className="mobile-user-header font-14 p-0">
        <div
          className="flex align-items-center justify-content-between p-13"
          onClick={() => udpateArrow(!arrowUserProfile)}
        >
          <div className="flex align-items-center">
            <img src={getAssetUrl('/interface/l-person-24px.svg')} alt="img" />
            <p className="ml-2">My Profile</p>
          </div>
          {!arrowUserProfile ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
        </div>
        {arrowUserProfile && <div className="line-black"></div>}
        {arrowUserProfile && (
          <div className="profile-sub-menu">
            <div onClick={clickPersonalDetails}>Personal Details</div>
            <div className="mt-8p" onClick={changePassword}>
              Change Password
            </div>
            <div className="mt-8p" onClick={verifyAccount}>
              Verify Account
            </div>
            <div className="mt-8p" onClick={logout}>
              Log out
            </div>
          </div>
        )}
      </div>

      <div className="mobile-user-header font-14">
        <div className="flex align-items-center" onClick={clickBetHistory}>
          <img src={getAssetUrl('/interface/l-history-24px.svg')} alt="img" />
          <p className="ml-2">Bet History</p>
        </div>
      </div>
      <div className="mobile-user-header font-14">
        <div className="flex align-items-center" onClick={clickTransactionHistory}>
          <img src={getAssetUrl('/interface/l-ic_transfer.svg')} alt="img" />
          <p className="ml-2">Transactions</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
