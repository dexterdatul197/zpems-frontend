import { configureStore } from "@reduxjs/toolkit";
import dialogsReducer from "./slices/dialogs";
// import authReducer from "./slices/auth";
import formsReducer from "./slices/forms";
// import globalReducer from "./slices/global";

export default configureStore({
  reducer: {
    dialogs: dialogsReducer,
    // auth: authReducer,
    forms: formsReducer,
    // global: globalReducer,
  },
});
