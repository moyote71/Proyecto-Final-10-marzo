 import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

// Load Envs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Models
import User from "../src/models/user.js";
import Category from "../src/models/category.js";
import Product from "../src/models/product.js";
import dbConnection from "../src/config/database.js";

const DEFAULT_PASSWORD = "Password123!";

const users = [
  {
    displayName: "Admin User",
    email: "admin@email.com",
    role: "admin",
    avatar: "https://placehold.co/100x100.png",
    isActive: true,
  },
  {
    displayName: "John Doe",
    email: "cliente@email.com",
    role: "customer",
    avatar: "https://placehold.co/100x100.png",
    isActive: true,
  },
  {
    displayName: "Jane Doe",
    email: "cliente2@email.com",
    role: "customer",
    avatar: "https://placehold.co/100x100.png",
    isActive: true,
  },
];

const categoriesMap = {
  Smartphones: {
    name: "Smartphones",
    description: "Teléfonos inteligentes",
    imageURL: "https://placehold.co/800x600.png",
    parentCategory: null
  },
  iPhone: {
    name: "iPhone",
    description: "Dispositivos iPhone",
    imageURL: "https://placehold.co/800x600.png",
    parentCategoryName: "Smartphones"
  },
  Android: {
    name: "Android",
    description: "Dispositivos Android",
    imageURL: "https://placehold.co/800x600.png",
    parentCategoryName: "Smartphones"
  }
};

const productsData = [
  {
    name: "iPhone 15 Pro",
    description: "El último iPhone de Apple con chip A17 Pro.",
    price: 999.99,
    stock: 50,
    imagesUrl: ["https://placehold.co/800x600.png"],
    categoryName: "iPhone"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Teléfono premium con Galaxy AI.",
    price: 1199.99,
    stock: 40,
    imagesUrl: ["https://placehold.co/800x600.png"],
    categoryName: "Android"
  },
  {
    name: "Google Pixel 8 Pro",
    description: "La mejor cámara de la línea Android pura.",
    price: 899.99,
    stock: 30,
    imagesUrl: ["https://placehold.co/800x600.png"],
    categoryName: "Android"
  }
];

const seedDatabase = async () => {
  try {
    // Reutilizar la conexión del proyecto
    await dbConnection();

    // Reset Opcional Controlado
    if (process.env.SEED_ALLOW_RESET === "true") {
      console.log("⚠️ SEED_ALLOW_RESET activado. Eliminando datos previos...");
      await User.deleteMany({});
      await Category.deleteMany({});
      await Product.deleteMany({});
    }

    console.log("🌱 Iniciando inserción de datos...");

    // 1. Usuarios
    console.log("Procesando Usuarios...");
    const hashPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create({ ...userData, hashPassword });
        console.log(`- Usuario creado: ${userData.email}`);
      } else {
        console.log(`- Usuario ya existe: ${userData.email} (omitiendo)`);
      }
    }

    // 2. Categorías
    console.log("Procesando Categorías...");
    const categoryDocMap = {};
    
    // Primero insertar/encontrar padres
    for (const key of Object.keys(categoriesMap)) {
      const catData = categoriesMap[key];
      if (!catData.parentCategoryName) {
        let cat = await Category.findOne({ name: catData.name });
        if (!cat) {
          cat = await Category.create({ 
            name: catData.name, 
            description: catData.description, 
            imageURL: catData.imageURL, 
            parentCategory: null 
          });
          console.log(`- Categoría padre creada: ${catData.name}`);
        } else {
          console.log(`- Categoría padre ya existe: ${catData.name}`);
        }
        categoryDocMap[catData.name] = cat._id;
      }
    }

    // Luego insertar hijas asociadas al objectID del padre
    for (const key of Object.keys(categoriesMap)) {
      const catData = categoriesMap[key];
      if (catData.parentCategoryName) {
        const parentId = categoryDocMap[catData.parentCategoryName];
        let cat = await Category.findOne({ name: catData.name });
        if (!cat) {
          cat = await Category.create({ 
            name: catData.name, 
            description: catData.description, 
            imageURL: catData.imageURL, 
            parentCategory: parentId 
          });
          console.log(`- Categoría hija creada: ${catData.name}`);
        } else {
          console.log(`- Categoría hija ya existe: ${catData.name}`);
        }
        categoryDocMap[catData.name] = cat._id;
      }
    }

    // 3. Productos
    console.log("Procesando Productos...");
    for (const prodData of productsData) {
      const categoryId = categoryDocMap[prodData.categoryName];
      let prod = await Product.findOne({ name: prodData.name });
      if (!prod && categoryId) {
        await Product.create({
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          stock: prodData.stock,
          imagesUrl: prodData.imagesUrl,
          category: categoryId
        });
        console.log(`- Producto creado: ${prodData.name}`);
      } else if (prod) {
        console.log(`- Producto ya existe: ${prodData.name}`);
      } else {
        console.log(`- Producto omitido (Categoría ${prodData.categoryName} no encontrada): ${prodData.name}`);
      }
    }

    console.log("✅ Ejecución del Seed Finalizada con Éxito");

  } catch (error) {
    console.error("❌ Error ejecutando seed:", error);
  } finally {
    // Cerrar conexión para que el script termine
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB.");
    process.exit(0);
  }
};

seedDatabase();
