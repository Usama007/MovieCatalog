import { createSlice } from '@reduxjs/toolkit'
const initialState = []
export const recentlyVisitedSlice = createSlice({
    name: 'recentlyVisited',
    initialState,
    reducers: {
        addToRecentlyVisited: (state, action) => {
            state.push(action.payload);
        },       
    },
})
export const { addToRecentlyVisited } = recentlyVisitedSlice.actions
export default recentlyVisitedSlice.reducer