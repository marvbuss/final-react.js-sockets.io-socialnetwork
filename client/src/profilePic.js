import Uploader from "./uploader";

export default function ProfilePic({ first, last, imageUrl }) {
    imageUrl = imageUrl || "default.png";
    return (
        <>
            <div>
                <h1>
                    {first}
                    {last}
                </h1>
                <img
                    src={imageUrl}
                    alt={`${first} ${last}`}
                    id="navbar-avatar"
                />
            </div>
            <Uploader />
        </>
    );
}
