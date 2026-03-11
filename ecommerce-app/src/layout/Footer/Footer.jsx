import { Link, useLocation } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import * as s from "./FooterStyles";

export default function Footer() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <footer className={s.footer()}>

            {/* MAIN FOOTER */}
            {isHome && (
                <section>
                    <div className={s.container()}>
                        <div className={s.main()}>

                            {/* Company */}
                            <div className={s.section()}>
                                <Link to="/" className={s.logo()}>
                                    Soluciones Mac
                                </Link>
                                <p className={s.description()}>
                                    Tu empresa de confianza para la reparación de cualquier dispositivo Apple, servicios y soluciones certificadas.
                                </p>

                                <div>
                                    <h4 className="text-white font-semibold mb-2">Síguenos</h4>
                                    <div className={s.socialIcons()}>
                                        <Link to="#"><Icon name="facebook" size={20} /></Link>
                                        <Link to="#"><Icon name="twitter" size={20} /></Link>
                                        <Link to="#"><Icon name="instagram" size={20} /></Link>
                                        <Link to="#"><Icon name="linkedin" size={20} /></Link>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className={s.section()}>
                                <h3 className="font-semibold text-white">Categorías</h3>
                                <ul className={s.categoryList()}>
                                    <li><Link className={s.link()} to="#">MacBook Air/Pro</Link></li>
                                    <li><Link className={s.link()} to="#">iMac</Link></li>
                                    <li><Link className={s.link()} to="#">iPhone</Link></li>
                                    <li><Link className={s.link()} to="#">iPad</Link></li>
                                    <li><Link className={s.link()} to="#">Apple Watch</Link></li>
                                    <li><Link className={s.link()} to="#">Servicio Windows</Link></li>
                                </ul>
                            </div>

                            {/* Customer Service */}
                            <div className={s.section()}>
                                <h3 className="font-semibold text-white">Atención al Cliente</h3>
                                <ul className={s.categoryList()}>
                                    <li><Link className={s.link()} to="#">Asesoría</Link></li>
                                    <li><Link className={s.link()} to="#">Servicios</Link></li>
                                    <li><Link className={s.link()} to="#">Reparaciones</Link></li>
                                    <li><Link className={s.link()} to="#">Hardware y Software</Link></li>
                                    <li><Link className={s.link()} to="#">Soluciones de iCloud</Link></li>
                                    <li><Link className={s.link()} to="#">Garantías</Link></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div className={s.section()}>
                                <h3 className="font-semibold text-white">Empresa</h3>
                                <ul className={s.categoryList()}>
                                    <li><Link className={s.link()} to="#">Sobre Nosotros</Link></li>
                                    <li><Link className={s.link()} to="#">Misión</Link></li>
                                    <li><Link className={s.link()} to="#">Objetivos</Link></li>
                                    <li><Link className={s.link()} to="#">Metas</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* TRUST SECTION */}
            {isHome && (
                <section className={s.trust()}>
                    <div className={s.container()}>
                        <div className={s.trustGrid()}>
                            <div className={s.trustItem()}>
                                <Icon name="shield" size={24} />
                                <strong>Compra Segura</strong>
                                <span>Protección SSL</span>
                            </div>

                            <div className={s.trustItem()}>
                                <Icon name="truck" size={24} />
                                <strong>Servicio a Domicilio</strong>
                                <span>Servicio Remoto</span>
                            </div>

                            <div className={s.trustItem()}>
                                <Icon name="rotateLeft" size={24} />
                                <strong>30 Días</strong>
                                <span>Garantía</span>
                            </div>

                            <div className={s.trustItem()}>
                                <Icon name="headphones" size={24} />
                                <strong>Soporte 24/7</strong>
                                <span>Atención al cliente</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* PAYMENT METHODS */}
            {isHome && (
                <section className={s.payment()}>
                    <div className={s.container()}>
                        <div className={s.paymentContent()}>

                            <div>
                                <h4 className="text-white font-semibold mb-2">Métodos de Pago</h4>
                                <div className={s.paymentIcons()}>
                                    <Icon name="visa" size={32} />
                                    <Icon name="mastercard" size={32} />
                                    <Icon name="amex" size={32} />
                                    <Icon name="paypal" size={32} />
                                    <Icon name="applepay" size={32} />
                                    <Icon name="googlepay" size={32} />
                                </div>
                            </div>

                            <div className={s.contact()}>
                                <h4 className="text-white font-semibold">Contacto</h4>
                                <span><Icon name="phone" size={16} /> 4491259985 - 4494489178 - 4492781992</span>
                                <span><Icon name="mail" size={16} /> centrodesoluciones.com</span>
                                <span><Icon name="clock" size={16} /> Lun-Vie 10:30-5:00 - Sabados 10:30-3:00</span>
                            </div>

                        </div>
                    </div>
                </section>
            )}

            {/* BOTTOM */}
            <section className={s.bottom()}>
                <div className={s.container()}>
                    <div className={s.bottomContent()}>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} SolucionesMac.com — Todos los derechos reservados.
                        </p>

                        <nav className={s.legalLinks()}>
                            <Link to="#">Privacidad</Link>
                            <Link to="#">Términos</Link>
                            <Link to="#">Cookies</Link>
                            <Link to="#">Accesibilidad</Link>
                            <Link to="#">Mapa del Sitio</Link>
                        </nav>
                    </div>
                </div>
            </section>

        </footer>
    );
}
