import React, { useState, useEffect } from 'react';
import CouponCard from './coupon-card';
import CouponService from 'services/CouponService';
import ScrollContainer from 'react-indiana-drag-scroll';
import { JumpingDots } from 'components/jumping-dots';

const Coupon = () => {
  const [couponSports, setCouponSports] = useState([]);

  useEffect(() => {
    (async () => {
      const assignTournaments = async (coupon) => {
        const tournaments = await CouponService.getCoupon(coupon.canonicalName);

        return {
          ...coupon,
          tournaments,
        };
      };

      const rawCoupons = await CouponService.getAllCoupons();
      const awaitTournaments = rawCoupons.map((coupon) => assignTournaments(coupon));
      const couponsTournaments = await Promise.all(awaitTournaments);

      const coupons = couponsTournaments
        .map((coupon) => ({
          ...coupon,
          tournaments: coupon?.tournaments
            .map((tournament) => ({
              ...tournament,
              items: tournament.items.filter((item) => {
                const tournamentCommonMarketGroups = Object.keys(tournament.commonMarketGroups);

                return tournamentCommonMarketGroups.some((tournamentCommonMarketGroup) =>
                  Object.values(item.marketGroups)
                    .map((itemVal) => itemVal.name)
                    .includes(tournamentCommonMarketGroup)
                );
              }),
            }))
            .filter((tournament) => !!tournament.items.length),
        }))
        .filter((coupon) => Array.isArray(coupon.tournaments) && coupon.tournaments.length);

      setCouponSports(coupons);
    })();
  }, []);

  const renderCouponCard = (commonMarketGroup, tournament, idx) => {
    // TODO component
    const couponTournament = { ...tournament };
    couponTournament.items = couponTournament.items.filter((item) => {
      const groups = { ...item.marketGroups };
      Object.keys(groups).forEach((key) => {
        if (key !== commonMarketGroup) {
          delete groups[key];
        }
      });

      return !!Object.keys(groups).length;
    });

    if (couponTournament.items.length) {
      return (
        <div className="coupon-wrap" key={idx}>
          <CouponCard tournament={couponTournament} marketGroup={commonMarketGroup} />
        </div>
      );
    }
  };

  if (!couponSports.length) {
    return (
      <div className="pt-112 coupon-page d-flex align-items-center">
        <JumpingDots />
      </div>
    );
  }

  return (
    <div className="pl-md-5 pr-md-5 pb-md-5 p-md-1 p-3 pt-112 d-flex flex-column coupon-page">
      {couponSports.map((couponSport, index) => {
        return (
          <div key={index}>
            <div className="coupon-label">{`${couponSport.name} Coupons`}</div>
            <div className="position-relative">
              <ScrollContainer>
                <div className="flex">
                  {couponSport.tournaments?.map((tournament) => {
                    return Object.keys(tournament.commonMarketGroups).map((key, tournamentIdx) => {
                      return renderCouponCard(key, tournament, tournamentIdx);
                    });
                  })}
                </div>
              </ScrollContainer>
              <div className="shadow-scroll"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Coupon;
