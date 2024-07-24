// TODO Refactor Yaroslav and/or Albert

import axios from 'axios';
import { handleErrorResponseObject } from 'utils/Utils';
import Env from 'utils/Env';
let allEntries = null;
class CouponService {
  getAllCoupons = () => {
    const api = Env.API_URL;

    return axios
      .get(`${api}/venus/sports?resolve=1`)
      .then((res) => {
        allEntries = res.data.data.entries;
        res.data.data.top = res.data.data.top.map((item) => {
          return {
            asset: item.asset,
            canonicalName: item.canonicalName,
            commonMarketGroups: Object.keys(item.mgs.first)
              .sort()
              .reduce((obj, key) => {
                obj[key] = item.mgs.first[key];

                return obj;
              }, {}),
            name: item.name,
          };
        });

        return res.data.data.top.filter((item) => item.canonicalName !== 'horseracing').slice(0, Env.COUPONS_SPORTS);
      })
      .catch((error) => handleErrorResponseObject(error));
  };

  getCoupon = (sport) => {
    const api = Env.API_URL;

    return axios
      .get(`${api}/venus/tournaments/${sport}?resolve=1&featured=1`)
      .then((res) => {
        const itemList = allEntries[sport].items;

        return res.data.data.entries.slice(0, Env.COUPONS_TOURNAMENTS).map((item) => ({
          ...item,
          sport,
          commonMarketGroups: { ...item.mgs.first, ...item.mgs.second },
          countryFlagPath: itemList[item.countryCanonicalName]?.flag?.path,
        }));
      })
      .catch((err) => {
        console.log(err);

        return err.response;
      });
  };
}

export default new CouponService();
