import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useSignMessage,
  useDisconnect,
  useContractRead,
  useContract,
  useBalance,
  useProvider,
  useSwitchNetwork,
  ConnectorData,
} from 'wagmi';
import { SNOWMEN_TOKEN_ADDRESS, SNOWMEN_GAME_ADDRESS } from '../src/blockchain/addresses';
import { SNOWMEN_GAME_ABI } from '../src/blockchain/abis/SnowmenGame.abi';
import { clientBackend, createMsg, showToast } from '../src/helpers';
import { connectUser, userItems, networkChanged } from '../src/redux/actions';
import { TICKET_ID } from '../src/blockchain/itemIds';
import items from '../src/blockchain/items.json';
import { useRouter } from 'next/router';

export const Header = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false); // Hydration failed because the initial UI does not match error
  const [tokenAmount, setTokenAmount] = useState('');
  const [ticketAmount, setTicketAmount] = useState('');
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState('');
  const { phaserLoaded, itemPurchased, ticketPurchased, isAuthenticated } = useSelector((state: any) => state);
  const { connector: activeConnector, address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnectAsync } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const router = useRouter();
  const provider = useProvider();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { data: tokenBalance, refetch: refetchToken } = useBalance({
    address: address,
    token: SNOWMEN_TOKEN_ADDRESS
  })

  const { data: ticketBalance, refetch: refetchTicket } = useContractRead({
    address: SNOWMEN_GAME_ADDRESS,
    abi: SNOWMEN_GAME_ABI,
    functionName: 'balanceOf',
    args: [address!, TICKET_ID],
  });

  const gameContract = useContract({
    address: SNOWMEN_GAME_ADDRESS,
    abi: SNOWMEN_GAME_ABI,
    signerOrProvider: provider,
  })

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (tokenBalance) {
      setTokenAmount(tokenBalance.formatted);
    }
  }, [isConnected]);

  useEffect(() => {
    async function getBalance() {
      const { data: newTokenBalance } = await refetchToken();
      if (newTokenBalance) {
        setTokenAmount(newTokenBalance.formatted);
      }
    }

    getBalance();
  }, [itemPurchased]);

  useEffect(() => {
    async function getBalance() {
      const { data: newTicketBalance } = await refetchTicket();
      if (newTicketBalance) {
        setTicketAmount(newTicketBalance!.toString());
      }
    }

    getBalance();
  }, [ticketPurchased]);

  useEffect(() => {
    if (isConnected) {
      const noTicket = +ticketBalance!.toString() <= 0 && +ticketAmount <= 0;

      if (router.asPath === '/' && noTicket) {
        showToast('info', '게임 시작을 위한 티켓이 필요합니다. 스토어에서 구매해주세요.', 3);
        logout();
      } else {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          if (phaserLoaded) {
            dispatch(connectUser(true));
          }
        } else {
          login();
        }
      }
    } else { // logout
      if (phaserLoaded) {
        dispatch(connectUser(false));
        logout();
      }
    }
  }, [isConnected, phaserLoaded]);

  useEffect(() => {
    async function getItems() {
      const items = await checkItems();
      if (items.length > 0) {
        dispatch(userItems(items));
      }
    }

    if (isAuthenticated) {
      getItems();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
      if (account) {
        logout();
      } else if (chain) {
        if (chain?.id !== 80001) {
          handleShow();
          setModalText('네트워크가 변경되었습니다. 폴리곤 Mumbai로 바꿔주세요');
          dispatch(networkChanged(true));
          switchNetwork?.(80001);
        } else {
          handleClose();
          dispatch(networkChanged(false));
        }
      }
    }

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate)
    }
  }, [activeConnector])

  const login = async () => {
    try {
      const res = await clientBackend.post('/user/login', { account: address });

      if (res.status === 200) {
        const message = createMsg(res.data.nonce);
        const signature = await signMessageAsync({ message })
        const { data } = await clientBackend.post('/user/verify', { account: address, signature });

        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          dispatch(connectUser(true));
        }
      }
    } catch (err: any) {
      console.error(err);
      await disconnectAsync();
    }
  };

  const logout = async () => {
    try {
      await disconnectAsync();
      dispatch(connectUser(false));
      localStorage.removeItem('accessToken');
      await clientBackend.post('/user/logout');
    } catch (err) {
      console.error(err);
    }
  };

  const checkItems = async () => {
    let tokenIds: string[] = [];

    try {
      for (const item of items) {
        const balance = await gameContract?.balanceOf(address, item.tokenId);
        if (balance > 0) {
          tokenIds.push(item.tokenId);
        }
      }
    } catch (err) {
      console.error(err)
    }

    return tokenIds;
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          {modalText}
        </Modal.Body>
      </Modal>

      <div>
        <Head>
          <title>SNOWMEN</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </div>

      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">SNOWMEN</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Game</Nav.Link>
            <Nav.Link href="/store">Store</Nav.Link>
          </Nav>
          <Nav className="me-auto">
            <Navbar.Text>
              {mounted && isConnected && (
                <strong>Balance: {tokenAmount} SNOW</strong>
              )}
            </Navbar.Text>
          </Nav>
          <ConnectButton />
        </Container>
      </Navbar>

      <br />
    </>
  );
};
