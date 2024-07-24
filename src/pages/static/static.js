import React, { useEffect, useState } from 'react';
import SportService from 'services/SportService';
import { Redirect } from 'react-router-dom';
import { JumpingDots } from 'components/jumping-dots';

const Static = (props) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    SportService.getStaticContent(props.match.params.slug)
      .then(({ data: { title, content } }) => {
        setTitle(title);
        setContent(content);
      })
      .catch((err) => {
        if (err.status === 404) {
          setNotFound(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.match.params.slug]);

  if (loading) {
    return <JumpingDots />;
  }

  if (notFound) {
    return <Redirect to="/" />;
  }

  return (
    <div className="d-flex p-md-2 p-0 ml-0 mr-0 pt-112">
      <div className="sport-main-container">
        <div className="static-title pl-3 mb-2">
          <p>{title}</p>
        </div>
        <div className="static-content p-3">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export { Static };
