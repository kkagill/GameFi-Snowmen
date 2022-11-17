import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import {
  chain,
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  useSwitchNetwork,
  useProvider,
  useContract,
  erc20ABI
} from 'wagmi';
import { SNOWMEN_SALES_ABI } from '../src/blockchain/abis/SnowmenSales.abi';
import { SNOWMEN_GAME_ABI } from '../src/blockchain/abis/SnowmenGame.abi';
import { 
  SNOWMEN_SALES_ADDRESS, 
  SNOWMEN_TOKEN_ADDRESS, 
  SNOWMEN_GAME_ADDRESS 
} from '../src/blockchain/addresses';
import { BigNumber, ethers } from 'ethers';
import { itemPurchased, ticketPurchased } from '../src/redux/actions';
import items from '../src/blockchain/items.json';
import { showToast } from '../src/helpers';
import { useDispatch, useSelector } from 'react-redux';

const Store = () => {
  const dispatch = useDispatch();
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState<BigNumber>();
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState('');
  const [itemRemainings, setItemRemainings] = useState<string[]>([]);
  const { address } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const provider = useProvider();
  const { purchasedTicket, purchasedItem } = useSelector((state: any) => state);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const gameContract = useContract({
    address: SNOWMEN_GAME_ADDRESS,
    abi: SNOWMEN_GAME_ABI,
    signerOrProvider: provider,
  })

  const {
    data: buyTicketData,
    write: buyTicket
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: SNOWMEN_SALES_ADDRESS,
    abi: SNOWMEN_SALES_ABI,
    functionName: 'buyTicket',
    overrides: {
      from: address,
      value: ethers.utils.parseEther('0.01'),
    },
    onSuccess() {
      setModalText('처리 중 입니다. 잠시만 기다려 주세요..');
    },
    onError(error) {
      handleClose();
      showToast('error', `${error?.reason}`, 2);
    },
  })

  const {
    data: buyItemData,
    write: buyItem
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: SNOWMEN_SALES_ADDRESS,
    abi: SNOWMEN_SALES_ABI,
    functionName: 'buyItem',
    args: [tokenId, amount],
    onSuccess() {
      setModalText('처리 중 입니다. 잠시만 기다려 주세요..');
    },
    onError(error) {
      handleClose();
      showToast('error', `${error?.reason}`, 2);
    },
  })

  const {
    data: approveData,
    write: approve
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: SNOWMEN_TOKEN_ADDRESS,
    abi: erc20ABI,
    functionName: 'approve',
    onSuccess() {
      setModalText('처리 중 입니다. 잠시만 기다려 주세요..');
    },
    onError(error) {
      handleClose();
      showToast('error', `${error?.reason}`, 2);
    },
  })

  useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess() {
      setModalText('마지막으로 구매 트랜젝션을 컨펌 해주세요.');
      buyItem?.();
    },
    onError(error) {
      handleClose();
      showToast('error', `${error?.reason}`, 2);
    },
  })

  useWaitForTransaction({
    hash: buyTicketData?.hash,
    onSuccess() {
      handleClose();
      showToast('success', '티켓 구매 완료 하였습니다.', 2);
      dispatch(ticketPurchased(true));
    },
    onError(error) {
      handleClose();
      showToast('error', `${error?.reason}`, 2);
    },
  })

  useWaitForTransaction({
    hash: buyItemData?.hash,
    onSuccess() {
      handleClose();
      showToast('success', '구매 완료 하였습니다.', 2);
      dispatch(itemPurchased(true));
    },
    onError(error) {
      handleClose();
      showToast('error', `${error?.reason}`, 2);
    },
  })

  useEffect(() => {
    checkNetworks();
  }, [activeChain?.id]);

  useEffect(() => {
    async function getRemainings() {
      const itemRemainings = await checkItemRemainings();
      console.log(itemRemainings)
      setItemRemainings(itemRemainings);
    }

    getRemainings();
  }, [gameContract, purchasedTicket, purchasedItem]);

  const checkItemRemainings = async () => {
    let balances: string[] = [];

    try {
      for (const item of items) {
        const balance = await gameContract?.balanceOf(SNOWMEN_SALES_ADDRESS, item.tokenId);
        if (balance > 0) {
          balances.push(balance.toString());
        } else {
          balances.push('0');
        }
      }
    } catch (err) {
      console.error(err)
    }

    return balances;
  }

  const checkNetworks = () => {
    if (activeChain?.id !== undefined) {
      if (activeChain?.id !== chain.polygonMumbai.id) {
        handleShow();
        setModalText('네트워크가 변경되었습니다. 폴리곤 Mumbai로 바꿔주세요');
        switchNetwork?.(chain.polygonMumbai.id);
      } else {
        handleClose();
      }
    }
  };

  const puchaseTicket = () => {
    setModalText('티켓 구매 컨펌 해주세요.');
    buyTicket?.();
    handleShow();
  }

  const purchaseItem = (tokenId: string, price: string) => {
    const amountInWei = ethers.utils.parseUnits(price, 18);
    setAmount(amountInWei);
    setTokenId(tokenId);
    setModalText('두개의 트랜젝션을 컨펌 하셔야 합니다. 먼저 토큰 승인 해주세요.');
    approve?.({ recklesslySetUnpreparedArgs: [SNOWMEN_SALES_ADDRESS, amountInWei] });
    handleShow();
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

      <Container>
        <Row xs={1} md={5}>
          <Col>
            <Card>
              <Card.Img variant="top" src="images/340282366920938463463374607431768211456.png" />
              <Card.Body>
                <Card.Title>Ticket</Card.Title>
                <Card.Text>
                  게임 시작을 위한 필수 티켓
                </Card.Text>
                <hr />
                <div style={{ textAlign: 'right' }}>
                  <p>0.01 MATIC</p>
                  <Button
                    variant="primary"
                    style={{ textAlign: 'right' }}
                    onClick={() => puchaseTicket()}
                  >
                    구매
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <hr />

        <Row xs={1} md={5}>
          {items && items.length > 0 && items.map((item, i) =>
            <Col key={i}>
              <Card>
                <Card.Img variant="top" src={item.image} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                  <hr />
                  <div style={{ textAlign: 'right' }}>
                    <p>남은 수량: {itemRemainings[i]}개</p>
                    <p>{item.price} SNOW</p>
                    <Button
                      variant="primary"
                      style={{ textAlign: 'right' }}
                      onClick={() => purchaseItem(item.tokenId, item.price)}
                    >
                      구매
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>

      <br />
    </>
  );
};

export default Store;