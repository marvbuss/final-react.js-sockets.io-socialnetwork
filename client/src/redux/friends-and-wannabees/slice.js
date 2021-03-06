export default function friendsAndWannabeesReducer(
    friendsAndWannabees = [],
    action
) {
    if (action.type === "friends-and-wannabees/received") {
        friendsAndWannabees = action.payload.friendships;
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
        const newFriendsAndWannabees = friendsAndWannabees.filter(
            (friendAndWannabee) => friendAndWannabee.id !== action.payload.id
        );
        return newFriendsAndWannabees;
    }

    return friendsAndWannabees;
}

export function receiveFriendsAndWannabees(friendships) {
    return {
        type: "friends-and-wannabees/received",
        payload: { friendships },
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
