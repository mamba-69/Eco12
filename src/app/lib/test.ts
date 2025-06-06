import { Client, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // or your IP if you're using XAMPP
  .setProject("67f3d215001b2e84935c");

const storage = new Storage(client);
storage.listFiles('media-bucket')
.then(console.log)
.catch(console.error);
console.log("done")