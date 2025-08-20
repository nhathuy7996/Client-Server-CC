import { getCouchbaseCollectionUser } from '../db/couchbaseClient';
import { UserDB } from '../types';


export const saveScore = async (userData: UserDB): Promise<UserDB> => {
    const collection = getCouchbaseCollectionUser();
    const result = await collection.replace(userData.userId, userData);
    return userData;
};

