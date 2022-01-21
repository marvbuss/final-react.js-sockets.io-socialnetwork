export default function friendsAndWannabeesReducer(
    friendsAndWannabees = null,
    action
) {
    if (action.type === "friends-and-wannabees/received") {
        friendsAndWannabees = action.payload.friendsAndWannabees;
    } else if (action.type === "friends-and-wannabees/accept") {
        const newFriendsAndWannabees = friendsAndWannabees.map(
            (friendAndWannabee) => {
                if (friendAndWannabee.id === action.payload.id) {
                    return {
                        ...friendAndWannabee,
                        accepted: true,
                    };
                }
                return friendAndWannabee;
            }
        );
        return newFriendsAndWannabees;
    } else if (action.type === "friends-and-wannabees/end") {
        friendsAndWannabees = friendsAndWannabees.filter(
            (friendAndWannabee) => friendAndWannabee.id !== action.payload.id
        );
    }

    return friendsAndWannabees;
}

export function receiveFriendsAndWannabees(friendships) {
    return {
        type: "friends-and-wannabees/received",
        payload: friendships,
    };
}

export function makeFriend(id) {
    return {
        type: "friends-and-wannabees/accept",
        payload: { id },
    };
}

export function makeUnfriend(id) {
    return {
        type: "friends-and-wannabees/end",
        payload: { id },
    };
}
