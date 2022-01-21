import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    makeFriend,
    makeUnfriend,
    receiveFriendsAndWannabees,
} from "./redux/friends-and-wannabees/slice.js";

export default function FriendsAndWannabees() {
    // Get access to the dispatch function
    const dispatch = useDispatch();

    // Select the Wannabees from the state
    const wannabees = useSelector((state) =>
        state.friendsAndWannabees.filter((friendship) => !friendship.accepted)
    );

    // Select the Friends from the state
    const friends = useSelector((state) =>
        state.friendsAndWannabees.filter((friendship) => friendship.accepted)
    );

    // Get all friends and wannabees when the component mounts
    useEffect(() => {
        fetch(`/friends-and-wannabees.json`)
            .then((data) => data.json())
            .then((data) => {
                dispatch(receiveFriendsAndWannabees(data));
            })
            .catch((err) => {
                console.log("err", err);
            });

        // STEP 1: Make GET request to fetch friends and wannabees
        // STEP 2: dispatch action to populate the redux state
    }, []);

    const handleAccept = (id) => {
        // Step 1: Make a POST request to update the DB
        console.log("handleAccept", id);

        fetch(`/api/friendship/status/${id}`, {
            method: "POST",
            body: JSON.stringify({ btnTxt: "Accept Friend Request" }),
        })
            .then((res) => res.json())
            .then(() => {
                const action = dispatch(makeFriend(id));
                dispatch(action);
            });
        // Step 2: Dispatch an action to update the Redux store
    };

    const handleUnfriend = (id) => {
        // Step 1: Make a POST request to update the DB
        console.log("handleUnfriend", id);

        fetch(`/api/friendship/status/${id}`, {
            method: "POST",
            body: JSON.stringify({ btnTxt: "Unfriend" }),
        })
            .then((res) => res.json())
            .then(() => {
                const action = dispatch(makeUnfriend(id));
                dispatch(action);
            });
        // Step 2: Dispatch an action to update the Redux store
    };

    return (
        <>
            {wannabees.map((wannabee) => {
                return (
                    <div key={wannabee.id}>
                        <p>
                            {wannabee.first} {wannabee.last}
                        </p>
                        <img
                            src={wannabee.image_url}
                            className="navbar-avatar"
                        />
                        <button onClick={() => handleAccept(wannabee.id)}>
                            Accept Friendship
                        </button>
                    </div>
                );
            })}

            {friends.map((friend) => {
                return (
                    <div key={friend.id}>
                        <p>
                            {friend.first} {friend.last}
                        </p>
                        <img src={friend.image_url} className="navbar-avatar" />
                        <button onClick={() => handleUnfriend(friend.id)}>
                            Unfriend
                        </button>
                    </div>
                );
            })}
        </>
    );
}
