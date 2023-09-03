if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
  };
  
  const express = require('express');
  const app = express();
  const swaggerUi = require('swagger-ui-express');
  const swaggerDoc = require('./swagger.json');
  const port = process.env.PORT || 3000;
  const router = require('./routes/index');
  const options = require('./swagger');
  const swaggerJSDoc = require('swagger-jsdoc')
  
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  app.use('/', router);
  
  // const specs = swaggerJSDoc(options);
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));
  app.listen(port, () => {
    console.log(`Berhasil run di port ${port}`)
  })