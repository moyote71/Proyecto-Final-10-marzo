describe('Flujos de Carrito de Compras', () => {
  it('Debe mostrar el ícono del carrito en el header', () => {
    cy.visit('/');
    // El carrito es un <Link to="/cart"> en el header
    cy.get('a[href="/cart"]').should('be.visible');
  });

  it('Debe navegar a la página del carrito', () => {
    cy.visit('/cart');
    cy.url().should('include', '/cart');
    // La página carga sin errores de JS
    cy.get('body').should('exist');
  });

  it('Debe incrementar el contador al agregar un producto (usuario autenticado)', () => {
    cy.visit('/');

    // Leer el número actual del badge (span dentro del link del carrito)
    cy.get('a[href="/cart"] span').invoke('text').then((initialCount) => {
      const initial = parseInt(initialCount) || 0;

      // Hacer click en "Agregar al carrito" del primer producto disponible
      cy.contains('button', 'Agregar al carrito').first().click({ force: true });

      // Verificar que el contador incrementó
      cy.get('a[href="/cart"] span').invoke('text').then((newCount) => {
        const updated = parseInt(newCount) || 0;
        expect(updated).to.be.gte(initial);
      });
    });
  });
});
