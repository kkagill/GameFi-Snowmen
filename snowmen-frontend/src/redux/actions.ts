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

export const gameLoaded = (loaded: boolean) => ({
    type: GAME_LOADED,
    payload: loaded,
});

export const userConnected = (isAuthenticated: boolean) => ({
    type: USER_CONNECTED,
    payload: isAuthenticated,
});

export const gameOver = (gameOverScore: number) => ({
    type: GAME_OVER,
    payload: gameOverScore
});

export const rewardLoading = (loading: boolean) => ({
    type: REWARD_LOADING,
    payload: loading
});

export const receivedReward = (received: boolean) => ({
    type: RECEIVED_REWARD,
    payload: received
});

export const itemPurchased = (purchased: boolean) => ({
    type: ITEM_PURCHASED,
    payload: purchased
});

export const ticketPurchased = (purchased: boolean) => ({
    type: TICKET_PURCHASED,
    payload: purchased
});

export const userItems = (items: string[]) => ({
    type: USER_ITEMS,
    payload: items
});