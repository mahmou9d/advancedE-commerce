import { TToast } from "@customTypes/toasts";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";


interface IToastsSlice {
    records: TToast[]
}

const initialState: IToastsSlice = {
    records: []
}

const toastsSlice = createSlice({
    name: "toasts",
    initialState,
    reducers: {
        removeToast: (state, action) => {
            state.records = state.records.filter((el) => el.id !== action.payload);
          },
          addToast:(state,action:PayloadAction<TToast>)=>{
              state.records.push({
                  id: nanoid(),
                  title: action.payload.title || action.payload.type,
                  type: action.payload.type,
                  message: action.payload.message,
                  delayAnimation: action.payload.delayAnimation || false,
                //   onCloseToast: action.payload.onCloseToast,
              });
          },
        stopDelayAnimation: (state, action) => {
            state.records.map((el) => {
                if (el.id === action.payload) {
                    return (el.delayAnimation = false);
                }
                return el;
            });
            console.log(state.records);
          },
    },
})


export const { removeToast, addToast, stopDelayAnimation }= toastsSlice.actions
export default toastsSlice.reducer