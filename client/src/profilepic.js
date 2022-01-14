export default function ProfilePic({
    last,
    first,
    imageUrl,
    cssClassName,
    toggleFunc,
}) {
    imageUrl = imageUrl || "default.png";

    return (
        <img
            onClick={() => toggleFunc()}
            src={imageUrl}
            alt={`${first} ${last}`}
            className={cssClassName}
        />
    );
}
