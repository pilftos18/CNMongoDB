import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class UserRepository {
    
    constructor(){
        this.collection = "users";
    }

 async signUp(newUser) {
 try {
    //1. get the database instance
        const db = getDB();
    //2. get the collection
        const collection = db.collection(this.collection);
    //3.insert in documents
        await collection.insertOne(newUser);

        return newUser;
    } catch (error) {
        console.log(error);
        throw new ApplicationError("something went wrong with Database", 500);
    }
}

async findbyemail(email) {
    try {
       //1. get the database instance
           const db = getDB();
       //2. get the collection
           const collection = db.collection(this.collection);
       //3.insert in documents
       return    await collection.findOne({email});
  
       } catch (error) {
           console.log(error);
           throw new ApplicationError("something went wrong with Database", 500);
       }
   }



async signIn(email, password) {
    try {
       //1. get the database instance
           const db = getDB();
       //2. get the collection
           const collection = db.collection(this.collection);
       //3.insert in documents
       return    await collection.findOne({email, password});
  
       } catch (error) {
           console.log(error);
           throw new ApplicationError("something went wrong with Database", 500);
       }
   }


// static signIn(email, password) {
//     const user = users.find(
//       (u) =>
//         u.email == email && u.password == password
//     );
//     return user;
//   }

    

}


export default UserRepository