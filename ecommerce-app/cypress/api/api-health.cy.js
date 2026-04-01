describe('Backend API Health & Endpoints', () => {
  const apiUrl = 'http://localhost:5000/api';

  it('Debe responder 200 en la ruta de productos', () => {
    cy.request('GET', `${apiUrl}/products`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('products');
      expect(response.body.products).to.be.an('array');
    });
  });

  it('Debe rechazar un login sin credentials (400/401)', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/auth/login`,
      body: {
        email: '',
        password: ''
      },
      failOnStatusCode: false
    }).then((response) => {
      // 400/422 = validación, 401 = credenciales, 429 = rate limit (express-rate-limit)
      expect(response.status).to.be.oneOf([400, 401, 422, 429]);
      // express-validator retorna { errors: [...] }, otros middlewares { message: "..." }
      const hasError = 'message' in response.body || 'errors' in response.body;
      expect(hasError).to.be.true;
    });
  });
});
