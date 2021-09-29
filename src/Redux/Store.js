import { createStore, applyMiddleware,compose  } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const middleWares = [thunk];

function configureStore(preloadedState) {
  const store = createStore(
    reducers,
    preloadedState,
    compose(
      applyMiddleware(...middleWares),
      //window?.__REDUX_DEVTOOLS_EXTENSION__ && window?.__REDUX_DEVTOOLS_EXTENSION__()
    )
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
