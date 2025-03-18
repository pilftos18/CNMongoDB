import ProductModel from './product.model.js';
import ProductRepository from './product.repository.js';


export default class ProductController {

    constructor(){
      this.productRepository = new ProductRepository();
    }



  async getAllProducts(req, res) {
    try {
      const product = await this.productRepository.getAll(req.body);
      console.log('product', product);
      res.status(200).send(product);
      
    } catch (error) {
      console.log(error);
      return res.status(404).send("something went wrong");
      
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes } = req.body;

      const newProduct = new ProductModel(
          name,
          null,
          parseFloat(price),
          req.file.filename,
          null,
          sizes.split(','),
          
      );
  
      const createdRecord =  await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
      
    } catch (error) {
        console.log(error);
        return res.status(404).send("something went wrong");
        
    }

  
  }

 async rateProduct(req, res, next) {
    try{
      const userID = req.userID;
      const productID = req.body.productId;
      const rating = req.body.rating;

      await this.productRepository.rateProduct(
          userID,
          productID, 
          rating
          
        );
        return res
          .status(200)
          .send('Rating has been added');
      } catch(err){
        console.log(err);
        
        console.log("Passing error to middleware");
        next(err);
      }
    }
   

 async getOneProduct(req, res) {
      try {
        const id = req.params.id;
        const product =  await this.productRepository.getById(id);
        if (!product) {
          res.status(404).send('Product not found');
        } else {
          return res.status(200).send(product);
        }
      } catch (error) {
        console.log(error);
        return res.status(404).send("something went wrong");
        
      }



  }

  async filterProducts(req, res) {
    try {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const category = req.query.category;
        const result = await this.productRepository.filter(
          minPrice,
          maxPrice,
          category
        );
        res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(404).send("something went wrong");
    }


  }
}
