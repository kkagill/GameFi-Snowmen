import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAccount } from 'wagmi';
import { gameLoaded } from '../src/redux/actions';
import { clientBackend } from '../src/helpers';

const Home = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { phaserLoaded, gameOverScore } = useSelector((state: any) => state);
 
  useEffect(() => {
    initPhaser();
  }, []);

  useEffect(() => {
    if (gameOverScore > 0) {
      saveScore();
    }
  }, [gameOverScore]);

  const initPhaser = async () => {
    const Phaser = await import('phaser');
    const { default: Boot } = await import('../src/scenes/Boot.js')
    const { default: Preloader } = await import('../src/scenes/Preloader.js')
    const { default: MainMenu } = await import('../src/scenes/MainMenu.js')
    const { default: MainGame } = await import('../src/scenes/Game.js')

    const config = {
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      autoFocus: true,
      width: 1024,
      height: 768,
      backgroundColor: '#3366b2',
      parent: 'game-fi',
      scene: [Boot, Preloader, MainMenu, MainGame],
      physics: {
        default: 'arcade',
        arcade: { debug: false }
      }
    };

    const game = new Phaser.Game(config);

    if (game) {
      dispatch(gameLoaded(true));
    }
  }

  const saveScore = async () => {
    try {
      await clientBackend.post('/reward/score', { account: address, score: gameOverScore });
      // dispatch(rewardLoading(false));
      // dispatch(gameOver(0));
      window.location.reload();
    } catch (err) {
      console.error(err);
      // dispatch(rewardLoading(false));
      // dispatch(gameOver(0));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {phaserLoaded ? (
        <div id="game-fi"></div>
      ) : (
        <img
          alt="loading"
          src="/assets/loading.gif"
        />
      )}
    </div>
  );
};

export default Home;