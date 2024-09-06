import { Client, Account, Databases, Storage } from 'appwrite'
import conf from '../conf/conf'

const client = new Client()

client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)

export const account = new Account(client)

export const storage = new Storage(client);

export const databases = new Databases(client);

export { client };