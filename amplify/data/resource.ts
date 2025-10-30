import { a, ClientSchema, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // 👤 USER
  User: a
    .model({
      id: a.id().required(),
      username: a.string().required(),
      email: a.string().required(),

      // Relación: un usuario tiene muchas órdenes
      orders: a.hasMany("Order", "userId"),
    })
    .authorization((allow) => [allow.owner()]),

  // 🛍️ PRODUCT
  Product: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      imageUrl: a.string(),

      // Relación inversa: un producto puede estar en varios OrderProduct
      orderProducts: a.hasMany("OrderProduct", "productId"),
    })
    .authorization((allow) => [allow.guest().to(["read"]), allow.owner()]), // Ejemplo: productos visibles públicamente

  // 📦 ORDER
  Order: a
    .model({
      id: a.id().required(),
      userId: a.id().required(),
      status: a.string().default("PENDING"),
      totalAmount: a.float(),

      // Relación: una orden pertenece a un usuario
      user: a.belongsTo("User", "userId"),

      // Relación N:M (una orden tiene muchos OrderProduct)
      orderProducts: a.hasMany("OrderProduct", "orderId"),
    })
    .authorization((allow) => [allow.owner()]),

  // 🔗 ORDER-PRODUCT (tabla intermedia)
  OrderProduct: a
    .model({
      id: a.id().required(),
      orderId: a.id().required(),
      productId: a.id().required(),
      quantity: a.integer().required(),

      // ✅ Campos desnormalizados (snapshot del producto en el momento de la compra)
      productName: a.string().required(),
      priceAtPurchase: a.float().required(),
      imageUrl: a.string(),

      // Relaciones
      order: a.belongsTo("Order", "orderId"),
      product: a.belongsTo("Product", "productId"),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
