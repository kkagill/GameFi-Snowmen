import {
  GAME_LOADED,
  USER_CONNECTED,
  GAME_OVER,
  REWARD_LOADING,
  RECEIVED_REWARD,
  ITEM_PURCHASED,
  TICKET_PURCHASED,
  USER_ITEMS,
} from "./types";

const initState = {
  phaserLoaded: false,
  isAuthenticated: false,
  gameOverScore: 0,
  rewardLoading: false,
  receivedReward: false,
  purchasedItem: false,
  purchasedTicket: false,
  userItems: [],
};

export const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case GAME_LOADED:
      return { ...state, phaserLoaded: action.payload };
    case USER_CONNECTED:
      return { ...state, isAuthenticated: action.payload };
    case GAME_OVER:
      return { ...state, gameOverScore: action.payload };
    case REWARD_LOADING:
      return { ...state, rewardLoading: action.payload };
    case RECEIVED_REWARD:
      return { ...state, receivedReward: action.payload };
    case ITEM_PURCHASED:
      return { ...state, purchasedItem: action.payload };
    case TICKET_PURCHASED:
      return { ...state, purchasedTicket: action.payload };
    case USER_ITEMS:
      return { ...state, userItems: action.payload };
    default:
      return state;
  }
};