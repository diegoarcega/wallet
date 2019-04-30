import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createRootReducer from './reducers'

import { rootSaga } from './sagas/index'

// middlewares
const sagaMiddleware = createSagaMiddleware()

// store
const store = createStore(createRootReducer(), applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

export default store
