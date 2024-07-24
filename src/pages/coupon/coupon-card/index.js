import React from "react";
import { useHistory } from "react-router-dom";

const CouponCard = ({ tournament, marketGroup }) => {

  const history = useHistory();
  const goToCouponDetail = () => {
    history.push(
      `/coupon/${tournament.sport}/${tournament.canonicalName}`,
      {
        marketGroup,
        displayName: tournament.displayName
      }
    );
  }

  const assetUrl = process.env.REACT_APP_ASSETS_URL;

  return (
    <div className="coupon-card p-3 d-flex flex-column cursor" onClick={() => goToCouponDetail()}>
      <img src={assetUrl + tournament.asset.path} className="background" alt="logo"/>
      <img src={assetUrl + tournament.countryFlagPath} className="flag" alt="flag"/>
      <div className="d-flex flex-column">
        <span className="name">{tournament.displayName}</span>
        <span className="type mt-2">{marketGroup} Coupon</span>
      </div>
    </div>
  );
};

export default CouponCard;
