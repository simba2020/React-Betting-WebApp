import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHorseHead } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { getAssetUrl } from 'utils/EnvUtils';

const QuickLink = (props) => {
  const links = props.links;
  const [minute, setMinute] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => setMinute(minute + 1), 1000 * 60);

    return () => clearTimeout(timer);
  });

  const newLinks = [...links]
    .sort((a, b) => (a.starts > b.starts ? 1 : b.starts > a.starts ? -1 : 0))
    .filter(function (el) {
      return el.starts > new Date().getTime() / 1000;
    });

  const renderTime = (initialTime) => {
    const current = new Date().getTime();

    return initialTime - current / 1000 < 3600 ? (
      <div className="d-inline time text-warning">
        {new Date(initialTime * 1000).getMinutes() > new Date().getMinutes()
          ? new Date(initialTime * 1000).getMinutes() - new Date().getMinutes() + 'm'
          : new Date(initialTime * 1000).getMinutes() + 60 - new Date().getMinutes() + 'm'}
      </div>
    ) : (
      <div className="d-inline time">{new Date(initialTime * 1e3).toTimeString().slice(0, 5)}</div>
    );
  };

  const goToDetail = (link) => {
    window.scrollTo(0, 0);
    history.push(`/horseracing/detail/${link.id}`);
  };

  return (
    <div id="football-quick-link" className="p-2">
      <p className="p-2 mt-0 mb-2 header">Quick Links</p>
      {newLinks.map((link, index) => (
        <div className="quick-unit-horse p-2 mb-2 cursor" key={index} onClick={() => goToDetail(link)}>
          <FontAwesomeIcon icon={faHorseHead} className="ml-2 mr-2" />
          <p>{link.name}</p>
          {link.isLive ? <img src={getAssetUrl('/interface/Live@2x.png')} className="ml-auto mr-2" alt="img" /> : null}
          <div className={link.isLive ? 'mt-1' : 'ml-auto mt-1'}>{renderTime(link.starts)}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickLink;
