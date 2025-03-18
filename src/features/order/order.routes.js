import express from 'express';
import OrderController from './order.controller.js';


// 2. Initialize Express Router.

const orderRouter  = express.Router();

const OrderController = new OrderController();

orderRouter.post("/", (req, res, next)=>{
    OrderController.placeOrder(req, res, next);
})

export default orderRouter;
