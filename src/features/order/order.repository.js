import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export default class OrderRepository{
        constructor(){
            this.collection = "orders";
        }

        async placeOrder(userId){

            await this.getTotalAmount(userId)
            //1 . Get CartItems and calculate total Amt

            //2. Create an order record.

            //3.Reduce the stock.

            //4. 
        }


        async getTotalAmount(userId) {
            const db = getDB();
            const items = await db.collection("cartItems").aggregate([
            {
                //1. Get Cart items for the user
                $match : {userID : new ObjectId(userId)}
            },
            //2. Get the Products from Products Collection.
            {
                $lookup:{
                    from :"products",
                    localField : ProdductID,
                    foreignField : "_id",
                    as:"ProductInfo"

                }
            },
            //3. unwind the Prductinfo
            {
                $unwind : "$ProductInfo"
            },
            //4. CALCULATE  TotalAmount  FOR  EACH CartItems.
            {
                $addFields:{
                    "totalAmount":{
                        $multiply : ["$ProductInfo.price","$quantity"]

                    }
                }
            }
        ]).toArray();
        const FinalTotalAmount = items.reduce((acc, item)=> acc + item.totalAmount, 0);

        console.log(FinalTotalAmount);
        
    }
}