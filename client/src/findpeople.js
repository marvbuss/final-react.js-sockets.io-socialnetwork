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
            <h1>Find People</h1>
            {showUser && <h3>Check out our latest members!</h3>}
            {showUser &&
                users.map((user) => (
                    <div key={user.id}>
                        <Link to={`/user/${user.id}`}>
                            <img
                                src={user.image_url}
                                className="navbar-avatar"
                            />
                        </Link>

                        <p>
                            {user.first} {user.last}
                        </p>
                    </div>
                ))}
            {showUser && <h3>Looking for someone?</h3>}
            <form>
                <input
                    type="text"
                    name="find"
                    placeholder="username"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>

            {!showUser &&
                users &&
                users.map((user) => (
                    <div key={user.id}>
                        <Link to={`/user/${user.id}`}>
                            <img
                                src={user.image_url}
                                className="navbar-avatar"
                            />
                        </Link>

                        <p>
                            {user.first} {user.last}
                        </p>
                    </div>
                ))}

            {!showUser && users.length === 0 && (
                <div key="0">
                    <p>No matches found</p>
                </div>
            )}
        </>
    );
}
