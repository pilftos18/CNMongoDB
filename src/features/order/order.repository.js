import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";

export default class OrderRepository{
        constructor(){
            this.collection = "orders";
        }

        async placeOrder(userId){
            const client = getClient();
            const session = client.startSession();
            try {

                const db = getDB();
                session.startTransaction();
                //1 . Get CartItems and calculate total Amt
                const items =  await this.getTotalAmount(userId);
                const finalTotalAmount = items.reduce((acc, item)=> acc + item.totalAmount, 0);
                console.log(finalTotalAmount);
                
                //2. Create an order record.
                const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date())
                db.collection(this.collection).insertOne(newOrder, {session});
                //3.Reduce the stock.
                //also check video upate stocks at 5min intervals
                //test in at 8.27min intervals
                for(let item of items) {
                    await db.collection("products").updateOne(
                        {_id : item.productID},
                        { $inc : { stock : -item.quantity}},
                        {session}
                    )
                }
                // throw new Error("Something went wrong in placeOrder")
                //4. clear the carts Items
                await db.collection("cartItems").deleteMany({
                    userID : new ObjectId(userId)
                }, {session});
                session.commitTransaction();
                session.endSession();
                return;
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
               console.log(error);
                throw new ApplicationError("something went wrong with Database", 500);    
            }
        }


        async getTotalAmount(userId, session) {
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
        ],(session)).toArray();
        return items;
      
    }
}