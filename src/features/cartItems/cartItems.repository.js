import { getDB } from "../../config/mongodb.js";
import { ObjectId, ReturnDocument } from "mongodb";

class CartItemsRepository {

    constructor(){
        this.collection = 'cartItemss';
    }

    async add( productID,userID, quantity ) {
       try {
        console.log(productID, userID, quantity);
        
        const db  = getDB();
        const collection = db.collection(this.collection);
        const id = await this.getNextCounter(db);
        //find the document
        //either insert or update
        //Insertion. 
       // await collection.insertOne({ productID :  new ObjectId(productID), userID :  new ObjectId(userID),quantity});

       await collection.updateOne(
                        {productID :  new ObjectId(productID), userID :  new ObjectId(userID)},
                        {
                            $setOnInsert: {_id: id},
                            $inc: { quantity: quantity}
                        },
                        {upsert: true})
        
       } catch (error) {
            console.log(error);
            throw new Error('Something went wrong with the database');
        
       }
    }


    async get(userID){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const cartItems = await collection.find({userID: new ObjectId(userID)}).toArray();
            return cartItems
            
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong with the database');
        
        } 
    }



    async delete(cartItemID, userID){
        try {

            const db = getDB();
            const collection = db.collection(this.collection);
            const isDeleted =   await collection.deleteOne({_id: new ObjectId(cartItemID), userID: new ObjectId(userID)});
            return isDeleted > 0;

            
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong with the database');
            
        }
    }


    async getNextCounter(db){
       const resultDocument =  await db.collection("counters").findOneAndUpdate(
        {_id:'cartItemId'},
        {$inc: {value : 1}},
        {returnDocument:'after'}
       )
       console.log("nfd",resultDocument.value.value);
       return resultDocument.value;
    }
}

export default  CartItemsRepository;