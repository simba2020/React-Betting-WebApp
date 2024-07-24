import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const FollowUs = (props) => {
  const { socialLinks } = props
  if (socialLinks === null){
    return null
  }

  return (
    <div id="betslip" className="mb-2">
      <div id="betslip-header">
        <div className="d-md-flex d-none">
          <p className="p-3">Follow us</p>
        </div>
      </div>
        <div id="inplay-body" className="p-md-2 p-0 pb-2 pt-1">
          <div className="p-md-2 p-0 secial-wrap text-center mt-3 mb-3">
            <img src={window.location.origin + "/assets/image/follow-us/icon-facebook.svg"} className="mr-5" alt="img" onClick={() => window.open(socialLinks.facebook, "_blank")}  />
            <img src={window.location.origin + "/assets/image/follow-us/icon-twitter.svg"} alt="img"  onClick={() => window.open(socialLinks.twitter, "_blank")}/>
            <img src={window.location.origin + "/assets/image/follow-us/icon_instagram.svg"} className="ml-5" alt="img" onClick={() => window.open(socialLinks.instagram, "_blank")}/>
          </div>
        </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  socialLinks: state.landing.socialLinks,
});

export default withRouter(connect(mapStateToProps, null)(FollowUs));
