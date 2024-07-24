import React, {useState} from "react";

const MarketFilter = ({id, item, marketgroup, marketGroup}) => {
  const [marketName, setMarketName] = useState(marketgroup[id]);

  const changeMarketName = (market) => {
    setMarketName(market)
    marketGroup(market, id)
  }

  return (
      <div className="market-group-wrap">
        {Object.keys(item.commonMarketGroups).map((market, index) => (
          <div className={marketName ===  market? "market-group-unit p-2 market-group-active" : "market-group-unit p-2"}  key={index} onClick={()=> changeMarketName(market)}>
            {item.commonMarketGroups[market]}
          </div>
        ))}
      </div>
  );
};

export default MarketFilter;
