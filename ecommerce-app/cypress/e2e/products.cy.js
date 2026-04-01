describe('Flujos de Catálogo y Búsqueda', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Debe cargar productos en la página principal', () => {
    // La API devuelve productos — esperamos que aparezcan botones "Agregar al carrito"
    cy.contains('button', 'Agregar al carrito', { timeout: 8000 })
      .should('have.length.greaterThan', 0);
  });

  it('Debe permitir buscar un producto', () => {
    // El Header tiene un input con placeholder "Buscar productos..."
    // Forzamos la visibilidad solo si es necesario, pero el nuevo viewport debería ayudar
    cy.get('input[placeholder="Buscar productos..."]').first()
      .should('be.visible')
      .type('mac{enter}', { force: true });
    // Verificar que la URL cambia a /search con el query
    cy.url().should('include', '/search');
  });
});
