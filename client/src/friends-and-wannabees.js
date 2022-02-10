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
    }, []);

    const handleAccept = (id) => {
        console.log("handleAccept", id);

        fetch(`/api/friendship/status/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ btnText: "Accept Friend Request" }),
        })
            .then((res) => res.json())
            .then(() => {
                const action = dispatch(makeFriend(id));
                dispatch(action);
            });
        // Step 2: Dispatch an action to update the Redux store
    };

    const handleUnfriend = (id) => {
        console.log("handleUnfriend", id);

        fetch(`/api/friendship/status/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ btnText: "Unfriend" }),
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
            <div className="friends-and-wannabees-container">
                <h1>Requests:</h1>
                <div className="wannabees-container">
                    {wannabees.map((wannabee) => {
                        return (
                            <div className="wannabee-list" key={wannabee.id}>
                                <h2>
                                    {wannabee.first} {wannabee.last}
                                </h2>
                                <img
                                    src={wannabee.image_url}
                                    className="friends-and-wannabees-avatar"
                                />
                                <button
                                    onClick={() => handleAccept(wannabee.id)}
                                >
                                    Accept Friendship
                                </button>
                            </div>
                        );
                    })}
                </div>
                <h1>Friends:</h1>
                <div className="friends-container">
                    {friends.map((friend) => {
                        return (
                            <div className="friend-list" key={friend.id}>
                                <h2>
                                    {friend.first} {friend.last}
                                </h2>
                                <img
                                    src={friend.image_url}
                                    className="friends-and-wannabees-avatar"
                                />
                                <button
                                    onClick={() => handleUnfriend(friend.id)}
                                >
                                    Unfriend
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
