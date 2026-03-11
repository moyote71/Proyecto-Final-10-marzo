import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { getCurrentUser, isAuthenticated, logout } from "../../utils/auth";
import Navigation from "../Navigation/Navigation";
import { headerStyles } from "./HeaderStyles";

export default function Header() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { isDarkMode, toggleTheme } = useTheme();
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();
    const navigate = useNavigate();

    const [isAuth, setIsAuth] = useState(true);
    const [user, setUser] = useState(getCurrentUser());

    const userMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const updateAuthState = () => {
            setIsAuth(isAuthenticated());
            setUser(getCurrentUser());
        };
        window.addEventListener("storage", updateAuthState);
        updateAuthState();
        return () => {
            window.addEventListener("storage", updateAuthState);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsUserMenuOpen(false);
                setIsMobileMenuOpen(false);
                setIsMobileSearchOpen(false);
            }
        };
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isMobileSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isMobileSearchOpen]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query.length === 0) {
            navigate("/search");
            setIsMobileSearchOpen(false);
            setIsMobileMenuOpen(false);
            return;
        }
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setIsMobileSearchOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleLogin = () => {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    };
    const handleRegister = () => {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    };
    const handleLogout = () => {
        logout();
        setIsAuth(false);
        setUser(null);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        window.location.reload();
    };

    const handleUserMenuToggle = () => setIsUserMenuOpen(!isUserMenuOpen);
    const handleMobileMenuOpen = () => setIsMobileMenuOpen(true);
    const handleMobileMenuClose = () => setIsMobileMenuOpen(false);
    const handleMobileSearchToggle = () => setIsMobileSearchOpen(!isMobileSearchOpen);

    const getUserInitials = (userData) => {
        if (!userData) return "U";
        const name =
            userData.displayName || userData.name || userData.email || "Usuario";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getDisplayName = (userData) => {
        if (!userData) return "Usuario";
        return userData.displayName || userData.name || userData.email || "Usuario";
    };

    return (
        <header className={headerStyles.root()}>
            {isMobileSearchOpen && (
                <div className={headerStyles.mobileSearchOverlay()}>
                    <div className={headerStyles.mobileSearchContainer()}>
                        <form
                            className={headerStyles.mobileSearchForm()}
                            onSubmit={handleSearch}
                        >
                            <button
                                type="button"
                                className={headerStyles.mobileSearchBack()}
                                onClick={() => setIsMobileSearchOpen(false)}
                            >
                                <Icon name="arrowLeft" size={20} />
                            </button>

                            <input
                                ref={searchInputRef}
                                type="text"
                                className={headerStyles.mobileSearchInput()}
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button
                                type="submit"
                                className={headerStyles.mobileSearchBtn()}
                            >
                                <Icon name="search" size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className={headerStyles.main()}>
                <div className={headerStyles.container()}>
                    <div className={headerStyles.content()}>
                        <button
                            className={headerStyles.mobileOnly(headerStyles.iconBtn())}
                            onClick={handleMobileMenuOpen}
                        >
                            <Icon name="menu" size={20} />
                        </button>

                        <Link to="/" className={headerStyles.logo()}>
                            Soluciones Mac<span className={headerStyles.logoExtension()}></span>
                        </Link>

                        <div className={headerStyles.desktopOnly(headerStyles.searchContainer())}>
                            <form className={headerStyles.searchForm()} onSubmit={handleSearch}>
                                <input
                                    className={headerStyles.searchInput()}
                                    placeholder="Buscar productos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className={headerStyles.searchBtn()}>
                                    <Icon name="search" size={18} />
                                </button>
                            </form>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                className={headerStyles.mobileOnly(headerStyles.iconBtn())}
                                onClick={handleMobileSearchToggle}
                            >
                                <Icon name="search" size={20} />
                            </button>

                            <div
                                ref={userMenuRef}
                                className={headerStyles.desktopOnly(
                                    headerStyles.userMenuWrapper()
                                )}
                            >

                                <button
                                    className={headerStyles.userInfo({
                                        active: isUserMenuOpen,
                                    })}
                                    onClick={handleUserMenuToggle}
                                >
                                    <div className={headerStyles.userAvatar()}>
                                        {isAuth ? getUserInitials(user) : <Icon name="user" size={16} />}
                                    </div>

                                    <div className={headerStyles.userTextWrapper()}>
                                        <span className={headerStyles.greeting()}>
                                            {isAuth
                                                ? `Hola, ${getDisplayName(user)}`
                                                : "Hola, Inicia sesión"}
                                        </span>
                                        <span className={headerStyles.accountText()}>
                                            {isAuth ? "Mi Cuenta" : "Cuenta y Listas"}
                                        </span>
                                    </div>

                                    <Icon
                                        name="chevronDown"
                                        size={14}
                                        className={isUserMenuOpen ? "rotate-180" : ""}
                                    />
                                </button>

                                {isUserMenuOpen && (
                                    <div className={headerStyles.userDropdown()}>
                                        {!isAuth ? (
                                            <>
                                                <div className={headerStyles.authHeader()}>
                                                    <Icon name="user" size={24} />
                                                    <span>Accede a tu cuenta</span>
                                                </div>
                                                <Link
                                                    to="/login"
                                                    className={headerStyles.authBtnPrimary()}
                                                    onClick={handleLogin}
                                                >
                                                    <Icon name="logIn" size={16} />
                                                    Iniciar Sesión
                                                </Link>
                                                <button
                                                    className={headerStyles.authBtnSecondary()}
                                                    onClick={handleRegister}
                                                >
                                                    <Icon name="userPlus" size={16} />
                                                    Crear Cuenta
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className={headerStyles.userProfile()}>
                                                    <div className={headerStyles.userAvatarLarge()}>
                                                        {getUserInitials(user)}
                                                    </div>
                                                    <div>
                                                        <div className={headerStyles.userName()}>
                                                            {getDisplayName(user)}
                                                        </div>
                                                        <div className={headerStyles.userEmail()}>
                                                            {user?.email}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={headerStyles.userLinks()}>
                                                    <Link to="/profile" className={headerStyles.userLink()}>
                                                        <Icon name="user" size={16} />
                                                        Mi Cuenta
                                                    </Link>
                                                    <Link to="/orders" className={headerStyles.userLink()}>
                                                        <Icon name="package" size={16} />
                                                        Mis Pedidos
                                                    </Link>
                                                    <Link to="/wishlist" className={headerStyles.userLink()}>
                                                        <Icon name="heart" size={16} />
                                                        Lista de Deseos
                                                    </Link>
                                                    <Link to="/settings" className={headerStyles.userLink()}>
                                                        <Icon name="settings" size={16} />
                                                        Configuración
                                                    </Link>
                                                </div>

                                                <div className={headerStyles.logoutSection()}>
                                                    <button
                                                        className={headerStyles.logoutBtn()}
                                                        onClick={handleLogout}
                                                    >
                                                        <Icon name="logOut" size={16} />
                                                        Cerrar Sesión
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Link to="/cart" className={headerStyles.cartBtn()}>
                                <Icon name="shoppingCart" size={24} />
                                <span className={headerStyles.cartBadge()}>{totalItems}</span>
                            </Link>

                            <button
                                className={headerStyles.desktopOnly(headerStyles.themeBtn())}
                                onClick={toggleTheme}
                            >
                                <Icon name={isDarkMode ? "sun" : "moon"} size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Navigation />

            {isMobileMenuOpen && (
                <div
                    className={headerStyles.mobileMenuOverlay()}
                    onClick={handleMobileMenuClose}
                >
                    <div
                        ref={mobileMenuRef}
                        className={headerStyles.mobileMenuContent()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={headerStyles.mobileMenuHeader()}>
                            <div className={headerStyles.mobileMenuLogo()}>
                                Soluciones Mac.com
                            </div>
                            <button
                                className={headerStyles.mobileMenuClose()}
                                onClick={handleMobileMenuClose}
                            >
                                <Icon name="x" size={24} />
                            </button>
                        </div>

                        <div className={headerStyles.mobileUserSection()}>
                            {!isAuth ? (
                                <>
                                    <div className={headerStyles.mobileAuthHeader()}>
                                        <Icon name="user" size={32} />
                                        <div>
                                            <h3 className="text-white">¡Hola!</h3>
                                            <p className="text-gray-400">
                                                Inicia sesión para una mejor experiencia
                                            </p>
                                        </div>
                                    </div>

                                    <div className={headerStyles.mobileAuthButtons()}>
                                        <Link
                                            to="/login"
                                            className={headerStyles.mobileAuthBtnPrimary()}
                                            onClick={handleLogin}
                                        >
                                            <Icon name="logIn" size={20} />
                                            Iniciar Sesión
                                        </Link>

                                        <button
                                            className={headerStyles.mobileAuthBtnSecondary()}
                                            onClick={handleRegister}
                                        >
                                            <Icon name="userPlus" size={20} />
                                            Crear Cuenta
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={headerStyles.mobileUserInfo()}>
                                    <div className={headerStyles.mobileUserAvatar()}>
                                        {getUserInitials(user)}
                                    </div>
                                    <div>
                                        <div className={headerStyles.mobileUserName()}>
                                            {getDisplayName(user)}
                                        </div>
                                        <div className={headerStyles.mobileUserEmail()}>
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <nav className={headerStyles.mobileCategoriesNav()}>
                            <h4 className={headerStyles.mobileNavTitle()}>
                                Compra por Categoría
                            </h4>
                            <Navigation isMobile={true} onLinkClick={handleMobileMenuClose} />
                        </nav>

                        {isAuth && (
                            <nav className={headerStyles.mobileMainNav()}>
                                <h4 className={headerStyles.mobileNavTitle()}>Mi Cuenta</h4>

                                <Link
                                    to="/profile"
                                    className={headerStyles.mobileNavLink()}
                                    onClick={handleMobileMenuClose}
                                >
                                    <Icon name="user" size={20} />
                                    Mi Perfil
                                </Link>

                                <Link
                                    to="/orders"
                                    className={headerStyles.mobileNavLink()}
                                    onClick={handleMobileMenuClose}
                                >
                                    <Icon name="package" size={20} />
                                    Mis Pedidos
                                </Link>

                                <Link
                                    to="/wishlist"
                                    className={headerStyles.mobileNavLink()}
                                    onClick={handleMobileMenuClose}
                                >
                                    <Icon name="heart" size={20} />
                                    Lista de Deseos
                                </Link>

                                <Link
                                    to="/settings"
                                    className={headerStyles.mobileNavLink()}
                                    onClick={handleMobileMenuClose}
                                >
                                    <Icon name="settings" size={20} />
                                    Configuración
                                </Link>
                            </nav>
                        )}

                        <nav className={headerStyles.mobileSupportNav()}>
                            <h4 className={headerStyles.mobileNavTitle()}>
                                Configuración y Ayuda
                            </h4>

                            <button
                                className={headerStyles.mobileNavLink()}
                                onClick={toggleTheme}
                            >
                                <Icon name={isDarkMode ? "sun" : "moon"} size={20} />
                                {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                            </button>

                            <Link
                                to="/help"
                                className={headerStyles.mobileNavLink()}
                                onClick={handleMobileMenuClose}
                            >
                                <Icon name="helpCircle" size={20} />
                                Centro de Ayuda
                            </Link>

                            <Link
                                to="/contact"
                                className={headerStyles.mobileNavLink()}
                                onClick={handleMobileMenuClose}
                            >
                                <Icon name="messageCircle" size={20} />
                                Contactar Soporte
                            </Link>
                        </nav>

                        {isAuth && (
                            <div className={headerStyles.mobileLogoutSection()}>
                                <button
                                    className={headerStyles.mobileLogoutBtn()}
                                    onClick={handleLogout}
                                >
                                    <Icon name="logOut" size={20} />
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
