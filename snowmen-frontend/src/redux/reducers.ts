import {
  LOAD_GAME,
  CONNECT_USER,
  GAME_OVER,
  LOAD_REWARD,
  PURCHASE_ITEM,
  PURCHASE_TICKET,
  USER_ITEMS,
  CHANGE_NETWORK,
} from "./types";

const initState = {
  phaserLoaded: false,
  isAuthenticated: false,
  gameOverScore: 0,
  rewardLoading: false,
  itemPurchased: false,
  ticketPurchased: false,
  networkChanged: false,
  userItems: [],
};

export const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case LOAD_GAME:
      return { ...state, phaserLoaded: action.payload };
    case CONNECT_USER:
      return { ...state, isAuthenticated: action.payload };
    case GAME_OVER:
      return { ...state, gameOverScore: action.payload };
    case LOAD_REWARD:
      return { ...state, rewardLoading: action.payload };
    case PURCHASE_ITEM:
      return { ...state, itemPurchased: action.payload };
    case PURCHASE_TICKET:
      return { ...state, ticketPurchased: action.payload };
    case USER_ITEMS:
      return { ...state, userItems: action.payload };
    case CHANGE_NETWORK:
      return { ...state, networkChanged: action.payload };
    default:
      return state;
  }
};