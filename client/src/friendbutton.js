import { useState, useEffect } from "react";

export function FriendButton({ id }) {
    const [error, setError] = useState(false);

    const errorMessage = "Something went wrong. Please try again!";

    useEffect(() => {
        fetch(`/api/friendship/${id}`)
            .then((data) => data.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log("err", err);
                setError(true);
            });
    }, [id]);

    return (
        <>
            {!error && <button></button>}
            {error && <p>{errorMessage}</p>}
        </>
    );
}
