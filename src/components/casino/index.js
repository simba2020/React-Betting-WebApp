import React, { Component } from 'react';

import ClientProfileService from 'services/ClientProfileService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { JumpingDots } from 'components/jumping-dots';
import { showQuickLogin } from 'redux/actions/auth';
import { connect } from 'react-redux';

class Casino extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      categories: [],
      selectedCategory: 1,
      loading: true,
      show: false,
      gameLoading: false,
    };
  }

  componentDidMount() {
    ClientProfileService.promotedCasinoGames().then((response) => {
      const categories = [];
      response.data.forEach((category) => {
        categories.push({
          id: category.id,
          name: category.name,
          games: category.games,
        });
      });
      // this.setState({ categories: categories, games: categories[0].games, loading: false });
    });
  }

  getCasinoGamesByCategory = (active) => {
    this.setState({ loading: true });
    this.setState({ selectedCategory: active });
    const selectedCategory = this.state.categories.find((category) => category.id === active);
    this.setState({ games: selectedCategory.games });
    this.setState({ loading: false });
  };

  playGame = (game) => {
    this.setState({ gameLoading: true });

    ClientProfileService.casinoGameUrl(game.id, 'desktop')
      .then((response) => {
        window.open(response.data.url, 'popup', `width=${window.innerWidth}, height=${window.innerHeight}`);
      })
      .catch(() => {
        this.props.showQuickLogin();
      })
      .finally(() => {
        this.setState({ gameLoading: false });
      });
  };

  demoGame = (game) => {
    this.setState({ gameLoading: true });

    ClientProfileService.casinoDemoUrl(game.id, 'desktop')
      .then((response) => {
        window.open(response.data.url, 'popup', `width=${window.innerWidth}, height=${window.innerHeight}`);
      })
      .catch(() => {
        this.props.showQuickLogin();
      })
      .finally(() => {
        this.setState({ gameLoading: false });
      });
  };

  render() {
    const responsive = {
      all: {
        breakpoint: { min: 0, max: 10000 },
        items: 1,
      },
    };
    const { games, categories, selectedCategory, loading, gameLoading } = this.state;

    if (loading) {
      return <JumpingDots />;
    }

    return (
      <div id="casino">
        <div id="casino-header" className="p-3" onClick={() => this.setState({ show: !this.state.show })}>
          <p>Casino</p>
          <FontAwesomeIcon
            icon={this.state.show ? faChevronDown : faChevronUp}
            className="ml-auto mr-2 mt-auto mb-auto text-white"
          />
        </div>
        <div id="casino-body" className={this.state.show ? 'd-none' : ''}>
          {gameLoading ? (
            <JumpingDots />
          ) : (
            <>
              <div className="d-flex p-2">
                {categories.map((category) => {
                  return (
                    <div
                      className={`casino-type ${
                        selectedCategory === category.id ? 'type-active' : ''
                      } d-flex align-items-center justify-content-center`}
                      key={category.id}
                      onClick={() => {
                        this.getCasinoGamesByCategory(category.id);
                      }}
                    >
                      <p>{category.name}</p>
                    </div>
                  );
                })}
              </div>
              <div className="p-2">
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  showDots={true}
                  arrows={false}
                  autoPlay={true}
                  autoPlaySpeed={5000}
                  containerClass="landing-carousel"
                  itemClass="landing-carousel-item"
                >
                  {Array.isArray(games) &&
                    games.map((game) => {
                      return (
                        <div key={game.id} className="casino-game-container">
                          <div className="casino-game">
                            <img src={game.smallImage} loading="lazy" className="casino-image" alt="casino_img" />
                          </div>
                          <div className="overlay">
                            <div className="text">{game.name}</div>
                            <div className="d-flex flex-column">
                              <div className="casino-box-btn play-btn" onClick={() => this.playGame(game)}>
                                Play
                              </div>
                              {game.supportsDemo && (
                                <div className="casino-box-btn play-demo mt-1" onClick={() => this.demoGame(game)}>
                                  Demo
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </Carousel>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  showQuickLogin,
};

export default connect(null, mapDispatchToProps)(Casino);
