import React, { useState, useRef } from 'react';
import Collapse from '@kunukn/react-collapse';
import Down from 'components/collapseDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import useOutsideClick from './useOutsideClick';
import { getAssetUrl } from 'utils/EnvUtils';

const Block = ({ isOpen, onToggle, children, data, eventName, marketGroup, marketgroup, marketGroup2, marketgroup2, sportName, iconPath }) => {
  const [arrow, setArrow] = useState(true);
  const [arrow2, setArrow2] = useState(true);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const ref = useRef();
  const ref2 = useRef();

  const clickDropdown = () => {
    setArrow(!arrow);
    setShow(!show);
  };

  const clickDropdown2 = () => {
    setArrow2(!arrow2);
    setShow2(!show2);
  };

  const clickItem = (param) => {
    setArrow(!arrow);
    setShow(!show);
    marketGroup(param);
  };

  const clickItem2 = (param, id) => {
    setArrow2(!arrow2);
    setShow2(!show2);
    marketGroup2(param, id);
  };

  useOutsideClick(ref, () => {
    setArrow(true);
    setShow(false);
  });

  useOutsideClick(ref2, () => {
    setArrow2(true);
    setShow2(false);
  });

  return (
    <div className="block w-100">
      <div className="btn toggle row collapse-header">
        <div className="col-xl-6 col-md-7 text-left d-flex p-0" onClick={onToggle}>
          <img src={getAssetUrl(iconPath)} className="mt-1" alt="img" />
          <p className="bet-sport-name mt-2 ml-2 text-uppercase">{sportName}: </p>
          <p className="bet-sport-name mt-2 ml-2">{eventName}</p>
        </div>
        <div className="col-xl-6 col-md-5 d-flex p-0">
          <div className="w-40 position-relative p-0">
            {Object.keys(data.commonMarketGroups).length === 0 && data.commonMarketGroups.constructor === Object ? null : (
              <div className="marketgroup-dropdown" style={{ zIndex: 2 }} ref={ref}>
                <div className="marketgroup-dropdown-header" onClick={clickDropdown}>
                  <p>{marketgroup}</p>
                  {arrow ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
                </div>
                {show ? (
                  <div className="marketgroup-dropdown-body p-1">
                    {Object.keys(data.commonMarketGroups).map((market, index) => {
                      if (marketgroup2 !== market) {
                        return (
                          <div className={marketgroup === market ? 'dropdown-body-item mb-1 selected-item' : 'dropdown-body-item mb-1'} key={index} onClick={() => clickItem(market)}>
                            <p>{data.commonMarketGroups[market]}</p>
                          </div>
                        );
                      }

                        return null;

                    })}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="w-40 position-relative p-0 ml-2">
            {Object.keys(data.commonMarketGroups).length === 0 && data.commonMarketGroups.constructor === Object ? null : (
              <div className="marketgroup-dropdown" style={{ zIndex: 2 }} ref={ref2}>
                <div className="marketgroup-dropdown-header" onClick={clickDropdown2}>
                  <p>{marketgroup2}</p>
                  {arrow2 ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
                </div>
                {show2 ? (
                  <div className="marketgroup-dropdown-body p-1">
                    {Object.keys(data.commonMarketGroups).map((market, index) => {
                      if (marketgroup !== market) {
                        return (
                          <div className={marketgroup2 === market ? 'dropdown-body-item mb-1 selected-item' : 'dropdown-body-item mb-1'} key={index} onClick={() => clickItem2(market)}>
                            <p>{data.commonMarketGroups[market]}</p>
                          </div>
                        );
                      }

                        return null;

                    })}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="w-20 p-0 text-right" onClick={onToggle}>
            <Down isOpen={isOpen} />
          </div>
        </div>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </div>
  );
};

export default Block;
