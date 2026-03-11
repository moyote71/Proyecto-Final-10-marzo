import ProfileCard from "../components/ProfileCard/ProfileCard";
import * as ProfileStyles from "./ProfileStyles";

export default function Profile() {
    return (
        <div className={ProfileStyles.page()}>
            <ProfileCard />
        </div>
    );
}
