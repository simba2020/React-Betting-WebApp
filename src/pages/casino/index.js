import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ClientProfileService from 'services/ClientProfileService';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useDispatch } from 'react-redux';
import { showQuickLogin } from 'redux/actions/auth';
import { JumpingDots } from 'components/jumping-dots';
import { isOverflown } from 'components/media-queries';

function CategoryBtn({ text, id, handleClick, active }) {
  return (
    <div className={id !== active ? 'category-btn' : 'category-btn active'} onClick={handleClick}>
      {text}
    </div>
  );
}

function CasinoGame({ game, height, playGame, desktop, demoGame }) {
  let w, transform;
  if (desktop) {
    // h = height ? 464 : 180;
    w = height ? 97 : 91;
    transform = height ? 'translate(2%, -50%)' : 'translate(5%, -50%)';
  } else {
    // h = height ? 306 : 125;
    transform = height ? 'translate(3.5%, -50%)' : 'translate(3.5%, -50%)';
  }

  return (
    <div className="casino-game-container col-xl-2 col-md-4 col-6">
      <div className="casino-game" style={{ width: w + '%' }}>
        <img src={game.smallImage} alt={game.name} />
        <div className="d-flex align-items-center justify-content-center casino-name">{game.name}</div>
      </div>
      <div className="overlay" style={{ transform: transform }}>
        <div className="text">{game.name}</div>
        <div className="d-flex flex-column align-items-center">
          <div className="play-btn" onClick={() => playGame(game)}>
            Play
          </div>
          {game.supportsDemo && (
            <div className="play-demo mt-2" onClick={() => demoGame(game)}>
              Demo
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CasinoPage() {
  const dispatch = useDispatch();
  const [categories, updateCategories] = useState([]);
  const [games, updateGames] = useState([]);
  const [allGames, updateAllGames] = useState([]);
  const [selectCategories, updateSelectCategories] = useState(0);
  const [loading, updateLoading] = useState(true);
  const [overflowed, setOverflowed] = useState(false);
  const casinoHeaderRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setOverflowed(isOverflown(casinoHeaderRef.current))
    }
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    (async function loadCategories() {
      const categories = await ClientProfileService.casinoCategories();
      updateCategories(categories.data);
    })();
    (async function loadGames() {
      const games = await ClientProfileService.casinoGames('');
      updateGames(games.data);
      updateAllGames(games.data);
      updateLoading(false);
    })();
  }, [updateGames]);

  const handleClick = async (active) => {
    updateSelectCategories(active);
    let tempGames = allGames;

    if (active !== 0) {
      tempGames = allGames.filter((game) => game.catIds.includes(active));
    }

    updateGames(tempGames);
  };

  const playGame = (game) => {
    ClientProfileService.casinoGameUrl(game.id, 'desktop')
      .then((response) => {
        window.open(response.data.url, 'popup', `width=${window.innerWidth}, height=${window.innerHeight}`);
      })
      .catch((err) => {
        if (err.response.data.code === 401) {
          toast.error(err.response.data.message);
          dispatch(showQuickLogin());
        }
      });
  };

  const demoGame = async (game) => {
    const url = await ClientProfileService.casinoDemoUrl(game.id, 'desktop');

    if (!url.success) {
      toast.error(url.data.message);
    } else {
      window.open(url.data.url, 'popup', `width=${window.innerWidth}, height=${window.innerHeight}`);
    }
  };

  const render_game_line = (start, end) => {
    const result = [];
    for (let i = 0; i < end; i++) {
      if (start + i < games.length)
        result.push(
          <CasinoGame
            key={games[start + i].id}
            game={games[start + i]}
            playGame={playGame}
            demoGame={demoGame}
            desktop={true}
          />
        );
    }

    return result;
  };
  const render_two_horizontal = (start) => {
    const result = [];
    for (let i = 0; i < 2; i++) {
      if (start + i < games.length)
        result.push(
          <CasinoGame key={games[start + i].id} game={games[start + i]} playGame={playGame} demoGame={demoGame} />
        );
    }

    return result;
  };

  const render_one_line = (start, device) => {
    if (device === 'desktop') {
      return (
        <div>
          <div className="casino-game-one-part" key={start}>
            <div className="casino-game-first-line flex">{render_game_line(start, 6)}</div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="casino-game-one-part" key={start}>
          <div className="casino-game-first-line flex">{render_two_horizontal(start)}</div>
        </div>
      </div>
    );
  };

  const render_game = (device) => {
    const elements = [];
    const nImagesInLine = 6;
    const patternsCount = Math.floor(games.length / nImagesInLine) + 1;
    for (let i = 0; i < patternsCount; i++) {
      elements.push(render_one_line(i * nImagesInLine, device));
    }

    return elements;
  };

  const casinoHeaderOverflown = (overflowRef) => {
    if (!overflowRef) {
      return;
    }
    casinoHeaderRef.current = overflowRef;
    setOverflowed(isOverflown(overflowRef));
  }

  if (loading) {
    return <JumpingDots />;
  }

  return (
    <div className="pt-48 casino">
      <div className="position-relative category-container">
        <ScrollContainer>
          <div className="flex casino-header justify-content-between align-items-center" ref={el => casinoHeaderOverflown(el)}>
            <div className="flex category-list align-items-center">
              <CategoryBtn text="All" id={0} handleClick={() => handleClick(0)} active={selectCategories} />
              {categories.map((category) => (
                <CategoryBtn
                  text={category.name}
                  id={category.id}
                  key={category.id}
                  handleClick={() => handleClick(category.id)}
                  active={selectCategories}
                />
              ))}
            </div>
          </div>
        </ScrollContainer>
        {overflowed && <div className="shadow-effect h-100 d-md-block d-none"></div>}
      </div>

      <div className="casino-body d-md-block d-none">{render_game('desktop')}</div>
      <div className="casino-body d-md-none d-block">{render_game('mobile')}</div>
    </div>
  );
}

export default CasinoPage;
