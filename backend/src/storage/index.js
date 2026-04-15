const localStorage = require("./local.storage");
// const azureStorage = require("./azure.storage"); // later

const storageType = process.env.STORAGE_TYPE || "local";

let storage;

switch (storageType) {
  case "azure":
    // storage = azureStorage;
    break;
  default:
    storage = localStorage;
}

module.exports = storage;
