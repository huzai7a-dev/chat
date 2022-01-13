import { createStore, applyMiddleware,compose  } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension';

const middleWares = [thunk];
let appliedMiddlewares =  applyMiddleware(...middleWares)
if (process?.env?.NODE_ENV && process?.env?.NODE_ENV != "production")
  appliedMiddlewares = composeWithDevTools(applyMiddleware(...middleWares))
function configureStore(preloadedState) {
  const store = createStore(
    reducers,
    preloadedState,
    appliedMiddlewares
  );

  if (module.hot) { 
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store = configureStore();

export default store;
