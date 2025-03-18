export default class OrderController{

    constructor(){
        this.OrderRepository = new this.OrderRepository();
    }

    async placeOrder(req, res, next){
        try {

            const userId = req.userId;
            await this.OrderRepository.placeOrder(userId);
            res.status(201).send("Order is Created");
        
        }catch(error) {
            
            console.log(error);
            return res.status(404).send("something went wrong");
        }
    }

}