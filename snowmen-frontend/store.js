import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { reducer } from "./src/redux/reducers";

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware, createLogger())
);

export default store;
