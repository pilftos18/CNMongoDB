import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb";

export default class OrderRepository{
        constructor(){
            this.collection = "orders";
        }

        async placeOrder(userId){
            //1 . Get CartItems and calculate total Amt

            //2. Create an order record.

            //3.Reduce the stock.

            //4. 
        }


        async getTotalAmount(userId) {
            const db = getDB();
            db.collection("cartItems").aggregate[{
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
            //unwind the ProductI
        
        ]
    }
}