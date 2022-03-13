import { configureStore } from "@reduxjs/toolkit";
import { indexPageReducer } from "./indexPageReducer";


export const store = configureStore({reducer: {
    indexPageReducer
}})