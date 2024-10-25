import { configureStore, createSlice } from '@reduxjs/toolkit';
import cartReducer from "./reducer";

// const store = configureStore({
//     reducer : {
//         cart : cartReducer
//     }
// });

// Tạo slice cho OTP
const otpSlice = createSlice({
    name: 'otp',
    initialState: {
        otp: null,
    },
    reducers: {
        setOtp: (state, action) => {
            state.otp = action.payload;
        },
        clearOtp: (state) => {
            state.otp = null;
        },
    },
});

export const { setOtp, clearOtp } = otpSlice.actions;

const store = configureStore({
    reducer: {
        otp: otpSlice.reducer,
    },
});
export default store;