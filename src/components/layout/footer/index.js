import React, { useState, useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
import { selectUserInfo } from 'redux/selectors/user';
import SportService from 'services/SportService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import { saveSocialLinks } from 'redux/reducers/landing';
import { JumpingDots } from 'components/jumping-dots';
import { getAssetUrl } from 'utils/EnvUtils';

const Footer = (props) => {
  const { saveSocialLinks } = props;

  const { isLoggedIn } = useSelector(selectUserInfo);

  const [collapse, setCollapse] = useState(true);
  const [contents, setContents] = useState(null);
  const [footerModalNavs, setFooterModalNavs] = useState([]);
  const [showFooterModal, setShowFooterModal] = useState(false);
  const [activeFooterModalPage, setActiveFooterModalPage] = useState(null);
  const [modalContent, setModalContent] = useState('');
  const [modalContentLoading, setModalContentLoading] = useState(true);

  const history = useHistory();

  const clickFooter = useCallback(
    (col) => {
      if (col.popup) {
        setShowFooterModal(true);
        setActiveFooterModalPage(col);
      } else {
        history.push(col.link);
      }
    },
    [history]
  );

  const receiveMessage = useCallback(
    (event) => {
      const { type, data } = event.data;
      if (type === 'showFooterModal') {
        clickFooter(data);
      }
    },
    [clickFooter]
  );

  useEffect(() => {
    window.addEventListener('message', receiveMessage, false);
  }, [receiveMessage]);

  useEffect(() => {
    SportService.getFooterContents()
      .then((res) => {
        setContents(res.data);
        setFooterModalNavs(res.data.columns.flat().filter((nav) => nav.popup));
        saveSocialLinks(res.data.socialMedia);
      })
      .catch(() => {});
  }, [saveSocialLinks]);

  useEffect(() => {
    if (activeFooterModalPage) {
      setModalContentLoading(true);
      SportService.getStaticContent(activeFooterModalPage.link)
        .then((response) => {
          setModalContent(response.data.content);
          setModalContentLoading(false);
        })
        .catch(() => setModalContentLoading(false));
    }
  }, [activeFooterModalPage]);

  const renderColumn = (cols) => {
    return cols.map((col, index) => (
      <span className="d-block grey-link mb-3" key={index} onClick={() => clickFooter(col)}>
        {col.name}
      </span>
    ));
  };

  const clickNavItem = (activePage) => {
    setActiveFooterModalPage(activePage);
  };

  const hideModal = () => {
    setShowFooterModal(false);
  };

  const defaultTab = 'bottom-tap-unit';
  const activeTab = 'bottom-tap-unit-active';

  return contents !== null ? (
    <>
      <div className="footer d-md-block d-none">
        <div className="d-flex top-footer">
          <div className="col col-xl-2 col-md-3 pl-0">
            <div className="btn-support-247" onClick={() => window.open(contents.supportLink)}>
              <img src={'/assets/image/footer/Ic_support.svg'} alt="img" className="mr-2" />
              <span>SUPPORT</span>
              <span className="ml-2 color-yellow text-nowrap">24/7</span>
            </div>
            <div className="mt-4 link-contact-us text-nowrap">
              <span>Contact Us</span>
              <span className="color-yellow ml-2">{contents.contactUsMobile}</span>
            </div>
          </div>
          <div className="col col-xl-4 col-md-4 pl-0 pr-0 grey-title">
            <div className="row ml-0">
              <span className="ml-3">{contents.companyDetails}</span>
            </div>
            <div className="row ml-0">
              <span className="ml-3">{contents.responsibleGaming}</span>
            </div>
          </div>
          <div className="row col col-xl-6 col-md-5 ml-2 mr-0 pl-0 pr-0">
            <div className="row w-100 pl-4 pr-5">
              <div className="col-5 pl-5 pr-0">{renderColumn(contents.columns[0], 0)}</div>
              <div className="col-7 footer-icons-wrap pl-0 pr-0 footer-magazines-container">
                <div className="title">As featured in:</div>
                <div className="footer-magazines mt-2">
                  <div className="magazines-row">
                    <img src={getAssetUrl('/magazines/cnn.png')} alt="CNN" />
                    <img src={getAssetUrl('/magazines/fox.png')} alt="Fox" />
                    <img src={getAssetUrl('/magazines/irish-post.png')} alt="Irish Post" />
                    <img src={getAssetUrl('/magazines/newsweek.png')} alt="Newsweek" />
                  </div>
                  <div className="magazines-row">
                    <img src={getAssetUrl('/magazines/marketwatch.png')} alt="MarketWatch" />
                    <img src={getAssetUrl('/magazines/metro.png')} alt="Metro" />
                    <img src={getAssetUrl('/magazines/mirror.png')} alt="Mirror" />
                  </div>
                  <div className="magazines-row">
                    <img src={getAssetUrl('/magazines/new-york-times.png')} alt="New York Times" />
                    <img src={getAssetUrl('/magazines/the-week.png')} alt="The Week" />
                    <img src={getAssetUrl('/magazines/usa-today.png')} alt="USA Today" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row bottom-wrap m-0">
          <div className="col-md-4 col-sm-12 pl-0 logo-icon-wrap">
            <img src={'/assets/image/footer/tether-usdt-logo.svg'} alt="img" />
            <span className="line ml-3 mr-3"> | </span>
            <span className="logo-text">1USDT = 1USD</span>
          </div>
          <div className="col-md-4 col-sm-10 pt-2 text-center">
            <span className="copy-right">{contents.copyright}</span>
            {!collapse && (
              <div className="footer-collapse ml-4" onClick={() => setCollapse(!collapse)}>
                <FontAwesomeIcon icon={faAngleDown} color="#CCD2E6" />
              </div>
            )}
          </div>
        </div>
        <Modal show={showFooterModal} onHide={() => hideModal()} id="third-party-modal" backdrop="static">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="d-flex h-100">
              <div className="col-3">
                {footerModalNavs?.map((nav, index) => {
                  return (
                    <div
                      className={
                        activeFooterModalPage?.name === nav.name
                          ? 'nav-item active p-2 pl-3 mt-3'
                          : 'nav-item p-2 pl-3 mt-3'
                      }
                      key={index}
                      onClick={() => clickNavItem(nav)}
                    >
                      {nav.name}
                    </div>
                  );
                })}
              </div>
              {activeFooterModalPage && (
                <div className="col-9 mt-3 overflow-auto page-content">
                  {modalContentLoading ? (
                    <JumpingDots />
                  ) : (
                    <div className="mt-3" dangerouslySetInnerHTML={{ __html: modalContent }} />
                  )}
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <div className="mobile-footer d-md-none d-flex">
        <NavLink to="/azsport" className={defaultTab} activeClassName={activeTab}>
          <img src={'/assets/image/footer/Ic_burger.svg'} alt="img" />
          <p>Az Sports</p>
        </NavLink>
        <NavLink
          to={isLoggedIn ? '/mobile-betslip' : '/login'}
          className={defaultTab}
          activeClassName={isLoggedIn ? activeTab : ''}
        >
          <img src={'/assets/image/footer/Icon_betslip.svg'} alt="img" />
          <p>Betslip</p>
          <div className="badge badge-pill badge-warning badge-betslip">
            {props.single_bets.length ? props.single_bets.length : ''}
          </div>
        </NavLink>
        <NavLink
          to={isLoggedIn ? '/user/bethistory' : '/login'}
          className={defaultTab}
          activeClassName={isLoggedIn ? activeTab : ''}
        >
          <img src={'/assets/image/footer/mybet.svg'} alt="img" />
          <p>My Bets</p>
        </NavLink>
        <NavLink to="/live" className={defaultTab} activeClassName={activeTab}>
          <img src={'/assets/image/footer/Ic_live.svg'} alt="img" />
          <p>In Play</p>
        </NavLink>
        <NavLink to="/search" className={defaultTab} activeClassName={activeTab}>
          <FontAwesomeIcon icon={faSearch} className="icon-search" />
          <p>Search</p>
        </NavLink>
      </div>
    </>
  ) : null;
};

const mapStateToProps = (state) => ({
  allSports: state.event.allSports,
  single_bets: state.betslip.betslip_single_bets,
});

const mapDispatchToProps = {
  saveSocialLinks,
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
