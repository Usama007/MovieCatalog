import { createSlice } from '@reduxjs/toolkit'
const initialState = []
export const watchListSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        addToWatchList: (state, action) => {
            state.push(action.payload);
        },
        removeFromWatchList: (state, action) => {
            let index = state.findIndex(item => { return item.id === action.payload.id });
            state.splice(index, 1);
        },
    },
})
export const { addToWatchList,removeFromWatchList } = watchListSlice.actions
export default watchListSlice.reducer