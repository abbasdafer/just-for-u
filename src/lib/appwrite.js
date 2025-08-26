"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databases = exports.account = void 0;
var appwrite_1 = require("appwrite");
var client = new appwrite_1.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68ac3dae00173e78a48b');
exports.account = new appwrite_1.Account(client);
exports.databases = new appwrite_1.Databases(client);
