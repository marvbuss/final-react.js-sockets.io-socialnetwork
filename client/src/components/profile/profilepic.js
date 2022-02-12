export default function ProfilePic({
    last,
    first,
    imageUrl,
    cssClassName,
    toggleFunc,
}) {
    imageUrl = imageUrl || "default.png";

    return (
        <>
            <div>
                <img
                    onClick={() => toggleFunc()}
                    src={imageUrl}
                    alt={`${first} ${last}`}
                    className={cssClassName}
                />
            </div>
        </>
    );
}
