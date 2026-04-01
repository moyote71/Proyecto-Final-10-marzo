import RegisterForm from "../components/RegisterForm/RegisterForm";
import registerStyles from "./RegisterStyles";

export default function Register() {
    return (
        <div className={registerStyles.container()}>
            <div className={registerStyles.card()}>
                <RegisterForm />
            </div>
        </div>
    );
}
