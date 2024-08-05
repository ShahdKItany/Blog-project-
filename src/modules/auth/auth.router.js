//  الاشياء الي اليوزر بقدر يشتغل عليها ويعملها  قبل تسجيل الدخول..مثل عمليه الدخول --انشاء حساب --نسيت كلمه المرور 


//src\modules\auth\auth.router.js
import { Router } from 'express';
import userModel from '../../../DB/model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = Router();

app.post('/', async (req, res) => {


    const {name,email,password} = req.body;

    const passwordHash = bcrypt.hashSync(password, 8);

     await userModel.create({name, email, password:passwordHash});

      //const user = await userModel.create({name:name, email:email, password:passworrd});
      // create بدل insert  عشان اضيف الاتا على  الداتا بيس
      //return res.json({name,email,password});
     // return res.status(201).json({ message: 'success',user });

   return res.status(201).json({ message: 'success' });
});


app.post('/login',async(req,res)=>{

  const {email,password}= req.body;
  const user = await userModel.findOne({
    where:{
        email:email
    }
  });

  if(!user){
    return res.status(404).json({message:'email not found'});
  }

  const check =await bcrypt.compare(password,user.password);
  if(!check)//if =false
  {
  return res.status(400).json({message:"invalid password"});
}
const token = jwt.sign({ id:user._d,userName:user.user }, 'soso');

return res.status(200).json({message:"success",token});

});

export default app;
