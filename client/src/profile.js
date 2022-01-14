import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({
    first,
    last,
    imageUrl,
    toggleFunc,
    bio,
    updateBio,
}) {
    return (
        <>
            <ProfilePic
                first={first}
                last={last}
                imageUrl={imageUrl}
                cssClassName="profile-avatar"
                toggleFunc={toggleFunc}
            />

            <BioEditor
                first={first}
                last={last}
                bio={bio}
                updateBio={updateBio}
            />
        </>
    );
}
