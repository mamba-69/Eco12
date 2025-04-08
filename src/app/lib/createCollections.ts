import { Client, Databases, ID, Permission, Role } from "appwrite";

/**
 * In Appwrite SDK v17.0.1, database and collection creation must be done through the Appwrite console.
 * This function just checks if the necessary collections exist and advises on creation if they don't.
 */
export const createCollections = async (
  endpoint: string,
  projectId: string,
  databaseId: string
) => {
  try {
    console.log("Checking collections in Appwrite...");

    // Initialize Appwrite client
    const client = new Client().setEndpoint(endpoint).setProject(projectId);

    const databases = new Databases(client);

    console.log(`Using database ID: ${databaseId}`);
    console.log(
      "Note: Appwrite SDK v17 requires that databases and collections are created manually in the Appwrite console"
    );

    // Define collections that should exist
    const collectionIds = ["settings", "content", "media", "users", "blog"];

    // Check if collections exist
    for (const collectionId of collectionIds) {
      try {
        console.log(`Checking if collection ${collectionId} exists...`);
        await databases.listDocuments(databaseId, collectionId);
        console.log(`✅ Collection ${collectionId} exists.`);
      } catch (error) {
        console.error(
          `❌ Collection ${collectionId} not found or inaccessible.`
        );
        console.log(
          `Please create the '${collectionId}' collection in the Appwrite console.`
        );
      }
    }

    // Check if main documents exist
    try {
      console.log("Checking if settings document exists...");
      await databases.getDocument(databaseId, "settings", "main");
      console.log("✅ Settings document exists.");
    } catch (error) {
      console.log(
        "❌ Settings document does not exist, it will be created when the app runs."
      );
    }

    try {
      console.log("Checking if content document exists...");
      await databases.getDocument(databaseId, "content", "main");
      console.log("✅ Content document exists.");
    } catch (error) {
      console.log(
        "❌ Content document does not exist, it will be created when the app runs."
      );
    }

    console.log("Collection check completed.");

    console.log(`
    Please make sure the following collections exist in your Appwrite database (${databaseId}):
    
    1. settings - Stores site configuration
    2. content - Stores website content
    3. media - Stores media items
    4. users - Stores user information
    5. blog - Stores blog posts
    
    Each collection should have permissions set to "Any" for read, write, update, and delete operations.
    `);

    return true;
  } catch (error) {
    console.error("Error in collection check:", error);
    return false;
  }
};
