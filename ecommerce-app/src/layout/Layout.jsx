import { useLocation } from "react-router-dom";
import Footer from "./Footer/Footer"
import Header from "./Header/Header";
import Newsletter from "./Newsletter/Newsletter";
import LayoutStyles from "./LayoutStyles";

export default function Layout({ children }) {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className={LayoutStyles.layout()}>
            <Header />

            <main className={LayoutStyles.main()}>
                {children}
                {isHome && <Newsletter />}
            </main>

            <Footer />
        </div>
    );
}
