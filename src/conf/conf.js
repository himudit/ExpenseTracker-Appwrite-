const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),

    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),

    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

    appwriteCollection1Id: String(import.meta.env.VITE_APPWRITE_COLLECTION1_ID),

    appwriteCollection2Id: String(import.meta.env.VITE_APPWRITE_COLLECTION2_ID),

    appwriteCollection3Id: String(import.meta.env.VITE_APPWRITE_COLLECTION3_ID),

    appwriteCollection4Id: String(import.meta.env.VITE_APPWRITE_COLLECTION4_ID),

    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),

    appwriteBucket2Id: String(import.meta.env.VITE_APPWRITE_BUCKET2_ID)
}
export default conf;