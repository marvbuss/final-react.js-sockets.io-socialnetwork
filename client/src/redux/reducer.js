import { combineReducers } from "redux";
import friendsAndWannabeesReducer from "./friends-and-wannabees/slice.js";
import MessagesReducer from "./messages/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabees: friendsAndWannabeesReducer,
    chatMessages: MessagesReducer,
});

export default rootReducer;
