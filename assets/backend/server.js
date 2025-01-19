//2024-12-10

// Import dependencies
//require('dotenv').config();  //Load environment variables from .env file
import express, {json} from 'express'; 
import cors from 'cors'; //This is a lifesaver
import  pdfRouter from './routes/pdf.js';

//Initialize the app
const app = express();

//Set location of the app
const PORT = 3000;

//Enable
app.use(cors());
app.use(json());

//Set the app at a specific directory
app.use('/api/pdf', pdfRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
