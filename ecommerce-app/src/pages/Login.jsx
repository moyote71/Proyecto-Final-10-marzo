import LoginForm from "../components/LoginForm/LoginForm";
import loginStyles from "./LoginStyles";

export default function Login() {
    return (
        <div className={loginStyles.container()}>
            <div className={loginStyles.card()}>
                <LoginForm />
            </div>
        </div>
    );
}
