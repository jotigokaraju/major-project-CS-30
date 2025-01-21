// require('dotenv').config();  //Load environment variables from .env file
// const express = require('express'); 
// const cors = require('cors'); //This is a lifesaver
// const pdfRouter = require('./routes/pdf');
// //require('dotenv').config();  //Load environment variables from .env file
// import express, {json} from 'express'; 
// import cors from 'cors'; //This is a lifesaver
// import  pdfRouter from './routes/pdf.js';

// //Initialize the app
// const app = express();
// @@ -14,7 +14,7 @@ const PORT = 3000;

// //Enable
// app.use(cors());
// app.use(express.json());
// app.use(json());

// //Set the app at a specific directory
// app.use('/api/pdf', pdfRouter);