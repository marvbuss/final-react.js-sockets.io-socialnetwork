import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabees: friendsReducer,
});

export default rootReducer;
