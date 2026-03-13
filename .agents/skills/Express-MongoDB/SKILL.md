---
name: Express + MongoDB - MERN Backend Stack
description: Guía para crear APIs RESTful robustas y escalables usando Express.js y MongoDB. Cubre setup, autenticación JWT, Mongoose models, validaciones, manejo de errores y mejores prácticas de seguridad para el stack MERN.
scope: backend
trigger: cuando se trabaje con Express, MongoDB, MERN stack, APIs RESTful con Node.js, o autenticación JWT
tools: view, file_create, str_replace, bash_tool
version: 1.0.0
---

# Express + MongoDB - MERN Backend Stack

## 🎯 Propósito

Esta skill te guía para crear APIs RESTful robustas y escalables usando Express.js y MongoDB. Cubre desde setup hasta autenticación JWT, validaciones, manejo de errores y mejores prácticas de seguridad.

## 🔧 Cuándo Usar Esta Skill

- Crear APIs REST para aplicaciones MERN
- Implementar autenticación y autorización con JWT
- Diseñar modelos de datos con Mongoose
- Configurar middleware de validación y error handling
- Conectar frontend React con backend Express
- Desarrollar endpoints CRUD completos
- Implementar relaciones entre documentos en MongoDB

## 📚 Stack Tecnológico

- **Express.js** 4.x — Framework web minimalista
- **MongoDB** 6.x+ — Base de datos NoSQL
- **Mongoose** 7.x+ — ODM para MongoDB
- **JWT** — Autenticación stateless
- **bcryptjs** — Hash de passwords

## 🚀 Setup Inicial

```bash
npm init -y

# Dependencias principales
npm install express mongoose dotenv cors

# Autenticación
npm install bcryptjs jsonwebtoken

# Validación
npm install express-validator

# Desarrollo
npm install -D nodemon
```

**.env:**
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
```

**.env.example:**
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

### Estructura Recomendada

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Configuración de MongoDB
│   ├── models/
│   │   ├── User.js            # Modelo de usuario
│   │   └── Task.js            # Modelo de tarea (ejemplo)
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── helpers.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

**package.json scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  }
}
```

## 🗄️ Configuración y Server

**src/config/db.js:**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**src/server.js:**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## 📊 Modelos con Mongoose

**src/models/User.js:**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // No devolver en queries por defecto
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**src/models/Task.js:**
```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: { type: Date },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Índices para mejorar queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
```

## 🔐 Autenticación JWT

**src/middleware/auth.js:**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `User role '${req.user.role}' is not authorized to access this route`,
    });
  }
  next();
};

module.exports = { protect, authorize };
```

**src/controllers/authController.js:**
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register — Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login — Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me — Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
```

## 🛣️ Routes

**src/routes/auth.js:**
```javascript
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
```

**src/routes/tasks.js:**
```javascript
const express = require('express');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
```

## 📝 Controller CRUD Completo

**src/controllers/taskController.js:**
```javascript
const Task = require('../models/Task');

// GET /api/tasks — Private
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) { next(error); }
};

// GET /api/tasks/:id — Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this task' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) { next(error); }
};

// POST /api/tasks — Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) { next(error); }
};

// PUT /api/tasks/:id — Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: task });
  } catch (error) { next(error); }
};

// DELETE /api/tasks/:id — Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
```

## 🚨 Error Handling

**src/middleware/errorHandler.js:**
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === 'development') console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') error = { message: 'Resource not found', statusCode: 404 };

  // Mongoose duplicate key
  if (err.code === 11000) error = { message: 'Duplicate field value entered', statusCode: 400 };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = {
      message: Object.values(err.errors).map((val) => val.message),
      statusCode: 400,
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
```

## ✅ Validación de Datos

**src/middleware/validation.js:**
```javascript
const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
```

## 🔒 Seguridad Best Practices

```javascript
// CORS restringido
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));

// Rate limiting — npm install express-rate-limit
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Headers seguros — npm install helmet
const helmet = require('helmet');
app.use(helmet());

// Sanitización NoSQL injection — npm install express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
```

## ⚠️ Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `E11000 duplicate key` | Campo único repetido | Verificar existencia antes de insertar |
| `CastError: Cast to ObjectId` | ID inválido | Validar formato del ID antes del query |
| `ValidationError` | Datos inválidos | Usar validación en modelo y middleware |
| `UnhandledPromiseRejection` | Async sin catch | Wrap en try-catch + errorHandler |
| CORS errors | Headers faltantes | Configurar `cors()` correctamente |
| `JWT expired` | Token expirado | Implementar refresh token |

## 📋 Checklist de Validación

Antes de finalizar un endpoint:
- [ ] Autenticación implementada si es ruta privada
- [ ] Validación de input completa
- [ ] try-catch en todo async
- [ ] Status codes HTTP correctos (200, 201, 400, 401, 403, 404, 500)
- [ ] Responses consistentes: `{ success, data, message }`
- [ ] No exponer información sensible en errores
- [ ] Ownership verificado (el usuario puede acceder al recurso)
- [ ] Logs sin passwords ni tokens

---

*Versión: 1.0.0 | Scope: backend | Stack: Express 4.x / MongoDB 6.x / Mongoose 7.x / JWT*
