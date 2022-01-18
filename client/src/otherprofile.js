import { useParams, useHistory } from "react-router";
import { useState, useEffect } from "react";

export function OtherProfile() {
    const { id } = useParams();
    const history = useHistory();
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);

    const errorMessage = "Something went wrong. Please try again!";

    useEffect(() => {
        fetch(`/api/user/${id}`)
            .then((data) => data.json())
            .then((data) => {
                if (data.success === false) {
                    history.replace("/");
                } else {
                    const { id, bio, first, last, image_url } = data;
                    setUser({ id, bio, first, last, image_url });
                }
            })
            .catch((err) => {
                console.log("err", err);
                setError(true);
            });
    }, [id]);

    return (
        <>
            {!error && (
                <div key={user.id}>
                    <img src={user.image_url} className="profile-avatar" />
                    <p>
                        {user.first} {user.last}
                    </p>
                    <p>{user.bio}</p>
                </div>
            )}
            {error && <p>{errorMessage}</p>}
        </>
    );
}
