import React, { useState } from "react";
import { NewsletterStyle } from "./NewsletterStyle";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        console.log("Newsletter signup:", email);
        setEmail("");
    };

    return (
        <section className={NewsletterStyle.section()}>
            <div className={NewsletterStyle.container()}>
                <div className={NewsletterStyle.content()}>

                    {/* Texto */}
                    <div className={NewsletterStyle.textBox()}>
                        <h3 className={NewsletterStyle.title()}>
                            ¡Suscríbete a nuestro newsletter!
                        </h3>
                        <p className={NewsletterStyle.description()}>
                            Recibe ofertas exclusivas y novedades directamente en tu email.
                        </p>
                    </div>

                    {/* Formulario */}
                    <form className={NewsletterStyle.form()} onSubmit={handleNewsletterSubmit}>
                        <div className={NewsletterStyle.inputGroup()}>
                            <input
                                type="email"
                                className={NewsletterStyle.input()}
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className={NewsletterStyle.button()}>
                                Suscribirse
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </section>
    );
}
