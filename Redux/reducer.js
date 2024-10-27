import { createReducer } from "@reduxjs/toolkit";
import { addItem, congItem, removeAllItem, removeItem, truItem } from "./action";

const initialState = {
    items: [],
};

const cartReducer = createReducer(initialState, builder => {
    builder
    .addCase(congItem, (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
            existingItem.quantity++;
        }
    })
    .addCase(truItem, (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
            existingItem.quantity--;
            if (existingItem.quantity === 0) {
                state.items = state.items.filter(item => item.id !== action.payload.id);
            }
        }
    })
    .addCase(removeItem, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.id);
    })
    .addCase(addItem, (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (!existingItem) {
            state.items.push({ ...action.payload, quantity: 1 });
        }
    })
    .addCase(removeAllItem,(state, action) => {
        state.items = [];
    })
});

export default cartReducer;
