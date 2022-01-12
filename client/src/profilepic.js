export default function ProfilePic({ last, first, imageUrl, loggerFunc }) {
    imageUrl = imageUrl || "default.png";
    const nameSymbols = "!!!!&&****";

    return (
        <img
            onClick={() => loggerFunc(nameSymbols)}
            src={imageUrl}
            alt={`${first} ${last}`}
            id="navbar-avatar"
        />
    );
}
