import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

defineBackend({
  auth, //Cognito
  data, //DynamoDB + GraphQL API
  storage, //S3 Storage
});
