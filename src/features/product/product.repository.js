import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository{

    constructor(){
        this.collectionName = 'products';
    }

    async add(product)
    {
        try {
             //1. get db
            const db = getDB();
            //2. collection of 
            const collection = db.collection(this.collectionName);
            //3. insert new product in collection
            await collection.insertOne(product);
            return product;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong with Database", 500);  
        }
    }

    async getAll()
    {
        try {
            const db = getDB();
            const collection = db.collection(this.collectionName);
            const products = await collection.find().toArray();
           // console.log(products);
                return products;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong with Database", 500);
        }
    }

    async getById(id)
    {
        try {
            const db = getDB();
            const collection = db.collection(this.collectionName);
            const products = await collection.findOne({_id : new ObjectId(id) });
            return products;
            
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong with Database", 500);
        }
    }

    async filter(minPrice,maxPrice, category) 
    {
        try{
            const db = getDB();
            const collection = db.collection(this.collectionName);
            let filterExpression = {};
    
            if(minPrice) filterExpression.price = {$gte : parseFloat(minPrice) };
    
            if(maxPrice) filterExpression.price = { ...filterExpression.price, $lte : parseFloat(maxPrice)};
            
            if(category) filterExpression.category = category;
            
            const products = await collection.find(filterExpression).toArray();
            return products;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong with Database", 500);  
        }
       

    }

    //handle promises chanining
    async rateProduct(userID, productID, rating){
        try {
            const db = getDB();
            const collection = db.collection(this.collectionName);

            //1. remove the existing entry
            await collection.updateOne(
                {_id : new ObjectId(productID)},
                {$pull : { ratings : {userID : new ObjectId(userID)}}}
            );
            
            //2. Adding new ratings
            await collection.updateOne(
                { _id : new ObjectId(productID)},
                { $push :{ ratings : { userID: new ObjectId(userID) , rating} } }
            );
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong with Database", 500);  
        }

    }







    //lengthy way to update reatings
  /*  async rateProduct(userID, productID, rating){
        try {
            const db = getDB();
            const collection = db.collection(this.collectionName);
            // console.log(productID);  
            //1 . find the product
            const product = await collection.findOne({_id : new ObjectId(productID) });
            //2.find the rating
            const userRating = product?.ratings?.find(r => r.userID == userID);
            //3. update the rating if user already rated
            if(userRating){
                    await collection.updateOne(
                        { _id : new ObjectId(productID), "ratings.userID": new ObjectId(userID)},
                        { $set :{ "ratings.$.rating" : rating } }
                );
            } else {
                await collection.updateOne(
                    { _id : new ObjectId(productID)},
                    { $push :{ ratings : { userID: new ObjectId(userID) , rating} } }
                );
            }          
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong with Database", 500);  
        }

    }
        */

}

export default ProductRepository