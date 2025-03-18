import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import  bcrypt from 'bcrypt';

export default class UserController {

    constructor(){
      this.userRepository = new UserRepository();
    }
 

   async signUp(req, res) {
    try {
      const {
        name,
        email,
        password,
        type,
      } = req.body;

      const hashedpasswrd = await bcrypt.hash(password,12)
      const user = new UserModel(
        name,
        email,
        hashedpasswrd,
        type
      );
      await this.userRepository.signUp(user);
      res.status(201).send(user);
      
    } catch (error) {
      console.log(error);
      return res.status(404).send("something went wrong");
    }
     
  }

  async signIn(req, res, next) {
    try {
      const user = await this.userRepository.findbyemail(req.body.email);

      if(!user){
        res.status(404).send("Email ID no registered");
      }else{
        const result = await bcrypt.compare(req.body.password, user.password);
        // console.log(result);
        
        if(!result){
          res.status(404).send("Password is incorrect");
        }else{
           // 1. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: '1h',
            }
          );
          // 2. Send token.
          return res.status(200).send(token);
        }
      }    
    } catch (error) {
        console.log(error);
        return res.status(404).send("something went wrong");
    }
  }


}
