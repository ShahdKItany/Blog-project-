
//src\initAPP.js
import connectDb from '../DB/connection/connection.js';
import userRouter from './modules/user/user.router.js'; 
import authRouter from './modules/auth/auth.router.js';
import blogRouter from './modules/blog/blog.router.js'; 
import commentRouter from './modules/comment/comment.router.js';  
/*
حتى اعطي الصلاحيه للفرونت الحزين او اي حدا معاه ال 
api  يستخدمه 
import cors from 'cors';
app.use(cors());
*/

export const initApp = (app, express) => {

    connectDb();
    app.use(express.json());  //لحل مشكله الbuffer data

    app.get('/', (req, res) => {
        res.send('Hello World, I\'m honey!');
    });

    app.use('/users', userRouter);
    app.use('/auth',authRouter);
    app.use('/blogs',blogRouter);
    app.use('/comments', commentRouter); 

    app.use('*', (req, res) => {
        return res.status(404).json({ message: "Page not found" });
    });
};


