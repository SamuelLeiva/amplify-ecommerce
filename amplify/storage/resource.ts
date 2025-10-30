import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'marketplaceStorage',

  access: (allow) => ({
    "products-images/*": [
        allow.authenticated.to(["read", "write", "delete"]),
        allow.guest.to(["read"])
    ],
    
  })
});