---
name: Testing Strategies - Quality Assurance Practices
description: Guía para implementar estrategias de testing efectivas. Cubre testing pyramid, tipos de tests, TDD, BDD, coverage goals, CI/CD integration y mejores prácticas para asegurar calidad del código.
scope: workflow
trigger: cuando se planee estrategia de testing, se configure CI/CD con tests, o se diseñe quality assurance
tools: view, file_create, str_replace, bash_tool
version: 1.0.0
---

# Testing Strategies - Quality Assurance Practices

## 🎯 Propósito

Guía para implementar estrategias de testing efectivas. Cubre testing pyramid, TDD, BDD, coverage, integración en CI/CD y mejores prácticas.

## 🔧 Cuándo Usar Esta Skill

- Diseñar estrategia de testing
- Configurar CI/CD con tests
- Implementar TDD/BDD
- Definir coverage goals
- Debugging de tests flakey
- Code review de tests

## 📚 Testing Pyramid (Trophy)

```
       /\
      /E2E\      ← 10% (Cypress, Playwright)
     /------\
    /  Int   \   ← 40% (APIs, DBs con Jest/Supertest)
   /----------\
  /    Unit    \ ← 30% (Lógica aislada con Jest)
 /--------------\
  Static Analysis ← 30% (TypeScript, ESLint)
```

## 🔬 Tipos de Tests

### 1. Unit Tests

Prueban funciones o métodos aislados. Rápidos y baratos.

```javascript
describe('Calculator', () => {
  test('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### 2. Integration Tests

Prueban la interacción entre componentes (ej. API + Base de datos).

```javascript
describe('POST /users', () => {
  it('creates a new user', async () => {
    const res = await request(app).post('/users').send({ name: 'John' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
```

### 3. E2E Tests (End-to-End)

Prueban flujos completos desde la perspectiva del usuario (UI).

```javascript
// Playwright
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'user@test.com');
  await page.fill('[name=password]', 'pass');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

### 4. Component Tests

Prueban componentes UI aislados (React, Vue).

```javascript
test('Button triggers onClick', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 🎯 TDD (Test-Driven Development)

1. **RED:** Escribir test que falla
2. **GREEN:** Escribir código mínimo para que pase
3. **REFACTOR:** Mejorar el código

## 🥒 BDD (Behavior-Driven Development)

Usa sintaxis Gherkin (Given/When/Then):
```gherkin
Scenario: Successful login
  Given I am on the login page
  When I fill in "Email" with "test@doc.com"
  And I click "Submit"
  Then I should see "Welcome"
```

## 📊 Coverage Goals recomendados

- **Business Logic:** 90-100%
- **API Endpoints:** 80-90%
- **UI Components:** 70-80%
- **Utils/Helpers:** 90-100%

Configurar umbrales en `jest.config.js`:
```javascript
  coverageThresholds: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 },
  }
```

## 🔧 Test Doubles

- **Mocks:** Simulan dependencias y verifican llamadas (`jest.mock('./api')`)
- **Stubs:** Retornan respuestas predefinidas
- **Spies:** Monitorean llamadas a funciones reales (`jest.spyOn`)
- **Fakes:** Implementaciones funcionales ligeras (ej. DB en memoria)

## 🎯 Testing Best Practices

### AAA Pattern (Arrange-Act-Assert)

```javascript
test('creates user', async () => {
  // Arrange
  const data = { name: 'John' };
  
  // Act
  const user = await UserService.create(data);
  
  // Assert
  expect(user.name).toBe('John');
});
```

### F.I.R.S.T Principles
- **F**ast: Ejecución rápida
- **I**ndependent: Sin estado compartido
- **R**epeatable: Mismo resultado siempre
- **S**elf-validating: Pasan o fallan por sí solos
- **T**imely: Escritos en el momento adecuado

## 🔄 CI/CD Integration (GitHub Actions)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
```

## ⚠️ Anti-Patterns a evitar

- ❌ Tests genéricos: `expect(true).toBe(true)`
- ❌ Tests dependientes del orden de ejecución
- ❌ Probar implementación en lugar de comportamiento (como probar si se llamó el constructor de base de datos vs verificar si el guardado fue exitoso).
- ❌ Usar delays mágicos (`setTimeout`) en lugar de waits implícitos/explícitos.

## 📋 Checklist

- [ ] Caminos críticos testeados
- [ ] Casos borde cubiertos (null, empty, bounds)
- [ ] Operaciones asíncronas se esperan correctamente
- [ ] Tests corren y pasan en CI
- [ ] Limpieza de mocks/stubs después de cada test (`afterEach`)

---

*Versión: 1.0.0 | Scope: workflow | Standards: TDD, AAA Pattern*
