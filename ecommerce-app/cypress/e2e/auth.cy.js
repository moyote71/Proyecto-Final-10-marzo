describe('Flujos de Autenticación', () => {

  it('Debe cargar la página de login correctamente', () => {
    cy.visit('/login');
    cy.url().should('include', '/login');
    // Verificar que existe un formulario de login
    cy.get('input[type="email"], input[name="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Debe mostrar error con credenciales inválidas', () => {
    cy.visit('/login');
    cy.get('input[type="email"], input[name="email"]').type('correo-invalido@test.com');
    cy.get('input[type="password"]').type('wrongpassword123');
    cy.get('button[type="submit"]').click();

    // El componente <ErrorMessage> renderiza con clase CSS "error-message"
    cy.get('.error-message', { timeout: 8000 }).should('be.visible').and('not.be.empty');
  });
});
