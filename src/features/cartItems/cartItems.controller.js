import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export class CartItemsController {

    constructor(){
        this.cartRepository = new CartItemsRepository();
    }

   async add(req, res) {
            try {
                console.log(req.body);
                const { productId, quantity } = req.body;
                const userID = req.userID;

               await this.cartRepository.add(productId, userID, quantity );
                res.status(201).send("Cart is updated");
                
            } catch (error) {
                console.log(error);
                return res.status(404).send("something went wrong");
                
            }

    }

   async get(req, res){
        try {
            const userID = req.userID;
            const items =  await this.cartRepository.get(userID);
            return res.status(200).send(items);
            
        } catch (error) {
            console.log(error);
            return res.status(404).send("something went wrong");
            
        }
    }

    async delete(req, res) {
        try {
            
        const userID = req.userID;
        const cartItemID = req.params.id;
        const isDeleted = await this.cartRepository.delete(
            cartItemID,
            userID
        );
        console.log(isDeleted);
        
        if (!isDeleted) {
            return res.status(404).send("item not found")
        }
        return res
        .status(200)
        .send('Cart item is removed');
            
        } catch (error) {
            console.log(error);
            return res.status(404).send("something went wrong");  
        }

    }
}