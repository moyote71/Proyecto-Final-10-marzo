---
name: Frontend Design - UI/UX Patterns & Systems
description: Guía para crear interfaces de usuario profesionales y consistentes usando design systems, atomic design, y frameworks de UI modernos. Cubre desde fundamentos de diseño hasta implementación práctica con Tailwind, Material UI, y patrones enterprise.
scope: frontend
trigger: cuando se diseñen interfaces, se mencionen design systems, atomic design, Tailwind, Material UI, o patrones de UI/UX
tools: view, file_create, str_replace, bash_tool
version: 1.0.0
---

# Frontend Design - UI/UX Patterns & Systems

## 🎯 Propósito

Guía para crear interfaces profesionales y consistentes usando design systems, atomic design, Tailwind CSS y Material UI.

## 🔧 Cuándo Usar Esta Skill

- Crear design system desde cero
- Implementar atomic design
- Configurar Tailwind CSS o Material UI
- Diseñar componentes reutilizables
- Implementar responsive design y accessibility

## 📚 Principios Fundamentales de UI/UX

| Principio | Descripción |
|-----------|-------------|
| **Consistency** | Mismos colores, tipografía, espaciado |
| **Hierarchy** | Tamaños de texto, contraste, espaciado intencional |
| **Accessibility** | Contraste mínimo 4.5:1, keyboard nav, ARIA |
| **Feedback** | Loading, success/error, hover/active, transitions |

## 🎨 Atomic Design

```
Atoms → Molecules → Organisms → Templates → Pages
```

### Atoms — Componentes Básicos

```typescript
// Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', disabled = false, onClick,
}) => {
  const variants = {
    primary:   'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger:    'bg-red-600 hover:bg-red-700 text-white',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };

  return (
    <button
      className={`font-medium rounded transition-colors ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Input.tsx
export const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, error, label }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
```

### Molecules — Átomos Combinados

```typescript
// SearchBar.tsx
export const SearchBar: React.FC<{ onSearch: (q: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  return (
    <div className="flex gap-2">
      <Input value={query} onChange={setQuery} placeholder="Search..." />
      <Button onClick={() => onSearch(query)}>Search</Button>
    </div>
  );
};
```

### Organisms — Estructuras Complejas

```typescript
// LoginForm.tsx
export const LoginForm: React.FC<{ onSubmit: (email: string, password: string) => void }> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email is required';
    if (!password || password.length < 6) e.password = 'Password must be 6+ chars';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <Input label="Email *" value={email} onChange={setEmail} error={errors.email} />
      <Input label="Password *" type="password" value={password} onChange={setPassword} error={errors.password} />
      <Button type="submit" className="w-full mt-4">Sign In</Button>
    </form>
  );
};
```

## 🎨 Tailwind CSS

### Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

### Utility Classes Comunes

```typescript
// Layout
<div className="container mx-auto px-4">
<div className="flex justify-between items-center">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive (mobile-first)
<div className="w-full md:w-1/2 lg:w-1/3">
<p className="text-sm md:text-base lg:text-lg">

// Estados interactivos
<button className="hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 focus:ring-2 focus:ring-blue-500">
```

### Design Tokens

```typescript
export const variants = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  success:   'bg-green-600 text-white hover:bg-green-700',
  danger:    'bg-red-600 text-white hover:bg-red-700',
};

export const sizes = { xs: 'p-2', sm: 'p-3', md: 'p-4', lg: 'p-6', xl: 'p-8' };
```

## 📦 Material UI (MUI)

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

**theme.ts:**
```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 8 },
});
```

## 🎨 UI Patterns

### Card

```typescript
export const Card: React.FC<CardProps> = ({ title, subtitle, children, footer, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
    {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">{footer}</div>}
  </div>
);
```

### Modal

```typescript
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">✕</button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
```

### Toast / Notifications

```typescript
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: number; type: ToastType; message: string }>>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  return { toasts, addToast };
};
```

## ♿ Accessibility (a11y)

```typescript
// ✅ Semantic HTML
<nav><ul><li><a href="/">Home</a></li></ul></nav>
<main><article><h1>Title</h1><p>Content</p></article></main>

// ARIA labels
<button aria-label="Close modal" onClick={onClose}>✕</button>
<img src={avatar} alt={`${user.name}'s profile picture`} />
<input aria-describedby="email-error" aria-invalid={!!error} />
{error && <span id="email-error" role="alert">{error}</span>}

// Keyboard navigation
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') onClick();
  if (e.key === 'Escape') onClose();
};
<div role="button" tabIndex={0} onKeyDown={handleKeyDown} onClick={onClick}>Click me</div>
```

## ⚠️ Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| Espaciado inconsistente | Valores hardcoded | Usar design tokens |
| Contraste pobre | Colores sin validar | WCAG 4.5:1 mínimo |
| Sin acceso keyboard | Solo onClick | Agregar onKeyDown + tabIndex |
| Alt text faltante | Olvidar a11y | Siempre incluir alt en imágenes |
| Div soup | No usar semantic HTML | Tags semánticos: nav, main, article |

## 📋 Checklist de Validación

- [ ] Design tokens definidos (colors, spacing, typography)
- [ ] Componentes siguen atomic design
- [ ] Responsive en mobile, tablet, desktop (mobile-first)
- [ ] Contrast ratio > 4.5:1 verificado
- [ ] Keyboard navigation funciona
- [ ] Alt text en todas las imágenes
- [ ] ARIA labels donde corresponde
- [ ] Loading/error states implementados
- [ ] Focus states visibles

## 🎓 Best Practices

1. **Design tokens** — Centralizar valores de diseño
2. **Atomic design** — Componentes pequeños y reutilizables
3. **Mobile-first** — Diseñar para móvil primero
4. **Semantic HTML** — Usar tags correctos
5. **Accessibility first** — No es opcional
6. **Consistent spacing** — Scale: 8px, 16px, 24px, 32px…
7. **Typography scale** — Sistema de tamaños coherente
8. **Color system** — Paleta limitada y consistente

---

*Versión: 1.0.0 | Scope: frontend | Standards: WCAG 2.1 AA, Atomic Design*
