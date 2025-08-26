import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68ac3dae00173e78a48b');

export const account = new Account(client);
export const databases = new Databases(client);