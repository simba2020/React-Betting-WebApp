import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const BetSlipConflict = (props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="betslip-conflict-container mb-0">
      <div className="d-flex align-items-center">
        <p className="conflict-message">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          Selections can not be combined
        </p>
        {isExpanded ? (
          <FontAwesomeIcon icon={faChevronUp} className="ml-auto" onClick={() => setIsExpanded(false)} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} className="ml-auto" onClick={() => setIsExpanded(true)} />
        )}
      </div>
      {isExpanded && (
        <div className="conflict-item">
          <p className="conflict-event">{props.conflict.n}</p>
          <p className="conflict-result">{props.conflict.s}</p>
          {props.conflict.c.map((item, index) => {
            return (
              <div className="conflict-item" key={index}>
                <p className="conflict-event">{item.n}</p>
                <p className="conflict-result">{item.s}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BetSlipConflict;
