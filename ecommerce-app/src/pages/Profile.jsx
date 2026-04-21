import ProfileCard from "../components/ProfileCard/ProfileCard";
import * as ProfileStyles from "./ProfileStyles";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user } = useAuth();
    
    return (
        <div className={ProfileStyles.page()}>
            <ProfileCard user={user} />
        </div>
    );
}
