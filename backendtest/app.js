if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
  };
  
  const express = require('express');
  const swaggerOptions = require('./swagger');
  const swaggerUI = require('swagger-ui-express');
  const swaggerJsDoc = require('swagger-jsdoc');
  const app = express();
  const port = process.env.PORT || 3000;
  const router = require('./routes/index');
  
  // const swaggerOptions = 
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  // console.log(swaggerDocs);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
  
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use('/', router);
  

  app.listen(port, () => {
    console.log(`Berhasil run di port ${port}`)
  })