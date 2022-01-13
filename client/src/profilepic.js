export default function ProfilePic({ last, first, imageUrl, toggleFunc }) {
    imageUrl = imageUrl || "default.png";

    return (
        <img
            onClick={() => toggleFunc()}
            src={imageUrl}
            alt={`${first} ${last}`}
            id="navbar-avatar"
        />
    );
}
