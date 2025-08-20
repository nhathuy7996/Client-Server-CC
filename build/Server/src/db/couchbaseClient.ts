import couchbase, { Cluster, Bucket, Collection } from 'couchbase';

let cluster: Cluster;
let bucket: Bucket;

let exampleCollection: Collection; 

export async function connectToCouchbase() {
    try {
        // Kết nối với Couchbase Cluster
        cluster = await Cluster.connect('couchbase://173.249.45.66', {
            username: 'Administrator',
            password: 'xinhayquendi1!',
        });
    
        // Lấy bucket từ cluster
        bucket = cluster.bucket('Garden');

        //Get collection
        //collectionFarm = bucket.collection('FarmDatas');
        exampleCollection = bucket.collection('exampleCollection');
        

        console.log('Connected to Couchbase');
      } catch (err) {
        console.error('Failed to connect to Couchbase:', err);
      } 
}

/*
* query Data from couchbase
* @param query: string
* @returns array of rows
*/
export async function queryData(query: string){
    try {
        const result = await cluster.query(query);
        return result.rows; // Return array of rows
      } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch top users');
      }
}

export function getCouchbaseCollectionExample(): Collection {
  if (!exampleCollection) {
    throw new Error('Couchbase is not connected. Call connectToCouchbase first.');
  }
  return exampleCollection;
} 
