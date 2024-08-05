

import { Sequelize } from 'sequelize';


export const sequelize = new Sequelize('freedb_bolgProject', 'freedb_shahd', 'zq@bn!AxFS3f7@D', {
    host: 'sql.freedb.tech',
    port:3306,
    dialect:'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

  export const connectDb =async ()=>{
    try{
        return await sequelize.sync({alert:true});

    }
catch(error){
    console.log(" error connect db...");
    console.error('Error connecting to the database:', error.message);
}    

  }

  export default connectDb;