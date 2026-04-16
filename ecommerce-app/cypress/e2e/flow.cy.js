/// <reference types="cypress" />

/**
 * E2E — Flujo Completo Progresivo
 * 1. Registro de usuario nuevo
 * 2. Login con credenciales nuevas
 * 3. Navegación y Adición al carrito
 * 4. Checkout y Finalización de compra
 */

describe("E2E — Flujo Completo de Usuario", () => {
    const uniqueId = Date.now();
    const user = {
        name: `Test User ${uniqueId}`,
        email: `test_${uniqueId}@example.com`,
        password: "Password123!",
    };

    before(() => {
        // Asegurarse de que el servidor esté arriba con un retry inicial
        cy.visit("/");
    });

    it("Flujo: Registro -> Login -> Carrito -> Checkout", () => {
        // --- 1. REGISTRO ---
        cy.visit("/register");
        cy.get('input[name="name"]').type(user.name);
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="password"]').type(user.password);
        cy.get('input[name="confirmPassword"]').type(user.password);
        cy.contains("button", /Regístrate/i).click();

        // Tras registro exitoso, el AuthContext auto-login y redirige a Home
        cy.url().should("match", /\/$/);
        cy.contains(user.name.split(" ")[0]).should("be.visible");

        // --- 3. CARRITO ---
        cy.contains("Productos recomendados", { timeout: 15000 }).should("be.visible");
        
        // Agregar primer producto al carrito
        // Usamos force si hay algún overlay del header
        cy.contains("button", "Agregar al carrito").first().click({ force: true });
        
        // Ir al carrito
        cy.visit("/cart");
        cy.contains("Carrito de Compras").should("be.visible");
        cy.contains("Total a pagar").should("be.visible");

        // --- 4. CHECKOUT ---
        cy.contains("button", /Proceder al pago/i).click();
        cy.url().should("include", "/checkout");

        // Manejo de Dirección
        cy.get("body").then(($body) => {
            if ($body.find('input[name="address1"]').length > 0) {
                cy.get('input[name="address1"]').type("Calle Ficticia 123");
                cy.get('input[name="city"]').type("Ciudad de Prueba");
                cy.get('input[name="postalCode"]').type("12345");
                cy.get('input[name="country"]').type("México");
                cy.contains("button", /Guardar y Continuar/i).click();
            } else {
                cy.contains("button", /Continuar/i).first().click();
            }
        });

        // Manejo de Pago
        cy.get("body").then(($body) => {
            if ($body.find('input[name="cardNumber"]').length > 0) {
                cy.get('input[name="cardNumber"]').type("1234567812345678");
                cy.get('input[name="cardHolderName"]').type(user.name);
                cy.get('input[name="expireDate"]').type("12/28");
                cy.get('input[name="cvv"]').type("123");
                cy.contains("button", /Guardar y Continuar/i).click();
            } else {
                cy.contains("button", /Continuar/i).first().click();
            }
        });

        // Paso 3: Revisión y Finalizar
        cy.contains("Resumen de tu pedido").should("be.visible");
        cy.contains("button", /Finalizar Pedido/i).click();

        // --- 5. CONFIRMACIÓN ---
        cy.url().should("include", "/order-confirmation");
        cy.contains("¡Gracias por tu compra!").should("be.visible");
        cy.get("body").should("contain", "#");
    });

    it("Verifica estabilidad de imágenes en catálogo", () => {
        cy.visit("/");
        cy.contains("Productos recomendados", { timeout: 15000 });
        
        cy.get('img[alt]').each(($img) => {
            cy.wrap($img).should('have.attr', 'src').and('not.be.empty');
        });
    });
});
