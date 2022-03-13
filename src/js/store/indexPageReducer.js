import { createSlice, current } from "@reduxjs/toolkit"
import {data} from "../data"

const slice = createSlice({
    name: "indexPage",
    initialState: {
        currentSortCategory: "популярности",
        sortCategoryList: ["цене", "популярности", "алфавиту"],
        goodsCategoryList: ["все", "мясные", "сырные", "фруктовые"],
        currentGoodsCategory: "все",
        allAddedGoodCount: 0,
        totalSumOfGoodsPrice: 0,
        goodsList: [
           ...data
        ]
    },
    reducers: {
        setCurrentSortCategory: (state, action) => {
            const { payload } = action
            if (state.sortCategoryList.includes(payload)) {
                state.currentSortCategory = payload
            }
        },
        setSizeOfGood: (state, action) => {
            const { payload } = action
            const currentGood = state.goodsList.filter(v => {
                return v.id === payload.goodId
            })[0]
            currentGood.currentSizeId = payload.sizeId
        },
        setDoughTypeOfGood: (state, action) => {
            const { payload } = action
            const currentGood = state.goodsList.filter(v => {
                return v.id === payload.goodId
            })[0]
            currentGood.currentDoughTypeId = payload.doughId
        },
        setCurrentGoodCategory: (state, action) => {
            const { payload } = action
            state.currentGoodsCategory = payload
        },
        incrementAddedCount: (state, action) => {
            const { payload } = action
            const currentGood = state.goodsList.filter(v => {
                return v.id === payload.goodId
            })[0]
            currentGood.addedCount++
            state.allAddedGoodCount++
            state.totalSumOfGoodsPrice += payload.goodPrice
        },
    }
})

export const indexPageReducer = slice.reducer
export const {
    setCurrentSortCategory, 
    setCurrentGoodCategory,
    setSizeOfGood,
    setDoughTypeOfGood,
    incrementAddedCount
} = slice.actions