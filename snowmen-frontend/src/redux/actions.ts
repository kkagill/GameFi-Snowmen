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

export const loadGame = (loaded: boolean) => ({
    type: LOAD_GAME,
    payload: loaded,
});

export const connectUser = (isAuthenticated: boolean) => ({
    type: CONNECT_USER,
    payload: isAuthenticated,
});

export const gameOver = (gameOverScore: number) => ({
    type: GAME_OVER,
    payload: gameOverScore
});

export const loadReward = (loading: boolean) => ({
    type: LOAD_REWARD,
    payload: loading
});

export const purchaseItem = (purchased: boolean) => ({
    type: PURCHASE_ITEM,
    payload: purchased
});

export const purchaseTicket = (purchased: boolean) => ({
    type: PURCHASE_TICKET,
    payload: purchased
});

export const userItems = (items: string[]) => ({
    type: USER_ITEMS,
    payload: items
});

export const networkChanged = (changed: boolean) => ({
    type: CHANGE_NETWORK,
    payload: changed
});