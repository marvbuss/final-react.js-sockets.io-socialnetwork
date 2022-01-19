import { useState, useEffect } from "react";

export function FriendButton({ otherProfileUserId }) {
    const [error, setError] = useState(false);
    const [btnText, setBtnText] = useState("");

    const errorMessage = "Something went wrong. Please try again!";

    useEffect(() => {
        console.log(otherProfileUserId);
        fetch(`/api/friendship/${otherProfileUserId}`)
            .then((data) => data.json())
            .then((data) => {
                setBtnText(data);
            })
            .catch((err) => {
                console.log("err", err);
                setError(true);
            });
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        fetch(`/api/friendship/status/${otherProfileUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ btnText: btnText }),
        })
            .then((data) => data.json())
            .then((data) => {
                setBtnText(data);
            })
            .catch((err) => {
                console.log("err", err);
                setError(true);
            });
    };

    return (
        <>
            {!error && <button onClick={handleClick}>{btnText}</button>}
            {error && <p>{errorMessage}</p>}
        </>
    );
}
