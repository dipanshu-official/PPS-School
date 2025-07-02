import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './globalSlice'
import socketReducer from "./socketSlice.js";


export const store = configureStore({
  reducer: {
    global: globalReducer,
    socket:socketReducer
  },
})
