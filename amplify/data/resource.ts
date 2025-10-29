import { a, ClientSchema, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      id: a.id().required(),
      username: a.string().required(),
      email: a.string().required(),

      // Relación: un usuario tiene muchos productos
      products: a.hasMany("Product", "userId"),
    })
    .authorization((allow) => [allow.owner()]), // solo el owner puede acceder

  Product: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      imageUrl: a.string(),

      // Relación inversa
      userId: a.id().required(),
      user: a.belongsTo("User", "userId"),
    })
    .authorization((allow) => [allow.owner()]),

  Order: a
    .model({
      id: a.id().required(),
      productId: a.id().required(),
      userId: a.id().required(),
      quantity: a.integer().required(),
      status: a.string().default("PENDING"),

      // Relaciones opcionales
      product: a.belongsTo("Product", "productId"),
      user: a.belongsTo("User", "userId"),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
