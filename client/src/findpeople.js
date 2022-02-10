import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function FindPeople() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [showUser, setShowUser] = useState(true);

    useEffect(() => {
        let abort;
        if (!search) {
            fetch(`users/latest`)
                .then((latestUsers) => latestUsers.json())
                .then((latestUsers) => {
                    setShowUser(true);
                    setUsers(latestUsers);
                })
                .catch(console.log);
        } else {
            fetch(`users/${search}`)
                .then((matchedUsers) => matchedUsers.json())
                .then((matchedUsers) => {
                    setShowUser(false);
                    if (!abort) {
                        setUsers(matchedUsers);
                    }
                })
                .catch(console.log);
        }

        return () => {
            abort = true;
        };
    }, [search]);

    return (
        <>
            <div className="findpeople">
                {showUser && <h1>Check out our latest members!</h1>}
                {showUser && <h2>Looking for someone?</h2>}
                <form>
                    <input
                        type="text"
                        name="find"
                        placeholder="username"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            <div className="findpeople-container">
                {!showUser &&
                    users &&
                    users.map((user) => (
                        <div className="user-list" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <p>
                                    {user.first} {user.last}
                                </p>
                                <img
                                    src={user.image_url}
                                    className="findpeople-avatar"
                                />
                            </Link>
                        </div>
                    ))}

                {!showUser && users.length === 0 && (
                    <div key="0">
                        <p>No matches found</p>
                    </div>
                )}
                {showUser &&
                    users.map((user) => (
                        <div className="user-list" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <p>
                                    {user.first} {user.last}
                                </p>
                                <img
                                    src={user.image_url}
                                    className="findpeople-avatar"
                                />
                            </Link>
                        </div>
                    ))}
            </div>
        </>
    );
}
