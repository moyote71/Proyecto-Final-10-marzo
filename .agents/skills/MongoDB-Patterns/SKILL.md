---
name: MongoDB Patterns - Database Design
description: Guía para diseñar schemas eficientes en MongoDB y Mongoose. Cubre patrones de relaciones, indexación, aggregation pipeline, transacciones y optimización de queries.
scope: backend
trigger: cuando se diseñen schemas de MongoDB, se implementen relaciones entre documentos, o se optimicen queries
tools: view, file_create, str_replace, bash_tool
version: 1.0.0
---

# MongoDB Patterns - Database Design

## 🎯 Propósito

Guía para diseñar schemas eficientes en MongoDB/Mongoose. Cubre patrones de relaciones, indexación, aggregation pipeline, transacciones y optimización de queries.

## 🔧 Cuándo Usar Esta Skill

- Diseñar schema de base de datos para nueva feature
- Decidir entre embedded vs referenced documents
- Optimizar queries lentas
- Implementar relaciones complejas
- Usar aggregation pipeline para reportes
- Configurar índices para performance

## 📚 Filosofía de MongoDB

- **Document-Oriented** — Datos relacionados se almacenan juntos
- **Evita JOINs** — Desnormalización es común y buena práctica
- **Design for query patterns** — No para normalización perfecta

## 🎨 Patrones de Relaciones

### 1. Embedded Documents (One-to-Few)

**Cuándo usar:** Relación 1:N donde N < 100, datos siempre consultados junto al padre.

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  addresses: [{
    street: String,
    city: String,
    zipCode: String,
    type: { type: String, enum: ['home', 'work'] },
  }],
});

// Un solo fetch, atomic operations
const user = await User.findById(userId);
user.addresses; // Disponible inmediatamente
```

✅ Query sencilla | ❌ Documentos pueden crecer (límite 16MB)

### 2. Child Referencing (One-to-Many)

**Cuándo usar:** N > 100, los children se acceden independientemente.

```javascript
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Populate en query
const posts = await Post.find({ author: userId })
  .populate('author', 'name email')
  .sort({ createdAt: -1 });
```

✅ Escalable | ❌ Requiere populate (múltiples queries)

### 3. Many-to-Many (Two-Way Referencing)

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const courseSchema = new mongoose.Schema({
  title: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Mantener ambos lados sincronizados
userSchema.methods.enrollInCourse = async function(courseId) {
  this.enrolledCourses.push(courseId);
  await this.save();
  await Course.findByIdAndUpdate(courseId, { $addToSet: { students: this._id } });
};
```

### 4. Denormalization Pattern

**Cuándo usar:** Reads muy frecuentes, datos que no cambian mucho.

```javascript
const postSchema = new mongoose.Schema({
  title: String,
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,   // Denormalizado — no requiere populate
    avatar: String, // Denormalizado
  },
});

// ⚠️ Actualizar datos denormalizados cuando cambian
userSchema.post('save', async function() {
  if (this.isModified('name')) {
    await Post.updateMany(
      { 'author.id': this._id },
      { $set: { 'author.name': this.name } }
    );
  }
});
```

✅ Queries ultra rápidas | ❌ Consistencia manual

## 📊 Indexación

```javascript
// Single field
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Compound (orden importa)
// Sirve para: { user }, { user, status }, { user, status, priority }
taskSchema.index({ user: 1, status: 1, priority: -1 });

// Text search
postSchema.index({ title: 'text', content: 'text' });
const results = await Post.find({ $text: { $search: 'mongodb tutorial' } });

// Unique y Sparse
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1 }, { sparse: true });
```

### Analizar Performance

```javascript
const explain = await Post.find({ author: userId })
  .sort({ createdAt: -1 })
  .explain('executionStats');

console.log(explain.executionStats.totalDocsExamined); // Alto → necesitas índice
console.log(explain.executionStats.executionTimeMillis);
```

## 🔄 Aggregation Pipeline

```javascript
// Group By y Count
const postsByUser = await Post.aggregate([
  { $group: { _id: '$author', count: { $sum: 1 }, totalLikes: { $sum: '$likes' } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
]);

// Lookup (JOIN)
const postsWithAuthors = await Post.aggregate([
  { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'authorInfo' } },
  { $unwind: '$authorInfo' },
  { $project: { title: 1, 'authorInfo.name': 1, 'authorInfo.email': 1 } },
]);

// Dashboard Stats por mes
const stats = await Order.aggregate([
  { $match: { createdAt: { $gte: new Date('2024-01-01') }, status: 'completed' } },
  {
    $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: '$total' },
      avgOrderValue: { $avg: '$total' },
    }
  },
  { $sort: { '_id.year': -1, '_id.month': -1 } },
]);
```

## 💾 Transacciones

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Account.findByIdAndUpdate(fromId, { $inc: { balance: -amount } }, { session });
  await Account.findByIdAndUpdate(toId, { $inc: { balance: amount } }, { session });
  await Transaction.create([{ from: fromId, to: toId, amount }], { session });

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## 🎯 Patrones Avanzados

### Computed Pattern (Pre-calcular datos)

```javascript
orderSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.tax = this.subtotal * 0.16;
  this.total = this.subtotal + this.tax;
  next();
});
```

### TTL Index (Datos temporales)

```javascript
// Expirar sesiones automáticamente después de 24h
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
```

### Soft Delete

```javascript
const schema = new mongoose.Schema({
  // ...
  deletedAt: { type: Date, default: null },
});

schema.index({ deletedAt: 1 });

// Filtrar eliminados
const activeUsers = await User.find({ deletedAt: null });
```

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Document too large (>16MB) | Demasiados embedded docs | Usar referencing |
| Slow queries | Sin índices | Analizar con `.explain()` |
| N+1 queries | Populate en loops | Populate con arrays o aggregation |
| Inconsistent data | Denormalized data sin sync | Transactions o post middleware hooks |

## 📋 Checklist de Schema Design

- [ ] Patrón de relación correcto (embedded vs referenced)
- [ ] Índices definidos para los query patterns esperados
- [ ] Validaciones completas en el schema
- [ ] `timestamps: true` habilitado
- [ ] Unique index donde corresponde
- [ ] Pre/Post hooks documentados

## 🎓 Best Practices

1. **Design for query patterns** — Optimiza para las queries más frecuentes
2. **Denormalize when read >> write** — Performance vs consistencia
3. **Index strategically** — No todos los campos necesitan índice
4. **Use `.lean()`** — Para queries read-only, 5x más rápido
5. **Batch operations** — `bulkWrite()` es más eficiente
6. **Projections** — No retornar campos innecesarios
7. **TTL indexes** — Para datos temporales (sessions, logs, tokens)

---

*Versión: 1.0.0 | Scope: backend | Stack: MongoDB 6.x / Mongoose 7.x*
