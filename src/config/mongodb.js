
import { MongoClient } from "mongodb";

// const url = ;
// If the above url gives error (error may be caused due to IPv4/IPv6 configuration conflict), then try the url given below
// const url = "mongodb://127.0.0.1:27017/ecomdb";

 let client;
const connectToMongoDB = () =>{
    MongoClient.connect(process.env.DB_URL)
    .then(clientInstance =>{
        client = clientInstance;
        console.log("Mongodb is connected now");
        createCounter(client.db('ecomdb'));
        createIndexes(client.db('ecomdb'));
    })
    .catch(err=>{
        console.log(err);
    })
}


//=========  we can also write like this  ==========//
// const connectToMongoDB = async() =>{
//     try {
//          await MongoClient.connect(url);
//         console.log("Mongodb is connected now");
//        // return client;
//     } catch (error) {
//         console.error("Failed to connect to MongoDB", error);
        
//     }
// }

export const getDB = () =>{
    return client.db('ecomdb');
}

const createCounter = async(db)=>{
    const existingCounter = await  db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id: 'cartItemID', value:0})
    }
}

const createIndexes = async(db)=>{
    try {
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1, category:-1});
        await db.collection("products").createIndex({desc:"text"});
    } catch (error) {
        console.log(err);
    }
    console.log("Indexes are Created");
    
}






export default connectToMongoDB;