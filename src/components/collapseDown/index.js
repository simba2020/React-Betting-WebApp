import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const Down = ({ isOpen }) => {
  return !isOpen ? <FontAwesomeIcon icon={faAngleDown} className="collapse-icon mt-1" /> : <FontAwesomeIcon icon={faAngleUp} className="collapse-icon mt-1" />;
};
Down.defaultProps = {};

export default Down;
