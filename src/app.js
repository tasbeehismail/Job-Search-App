// For handling errors outside express without crashing the server (like undefined variables)
process.on('uncaughtException', (err) => {
    console.log(err);
})
import express from 'express'; 
import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.routes.js'; 

dotenv.config();

const bootstrap = async (app) => {
    app.use(express.json());
    
    app.use('/uploads', express.static('uploads'));

    await connectDB();

    app.use(routes);

    app.use(errorHandler);
    
    // For handling errors outside express without crashing the server (like db connection errors)
    process.on('unhandledRejection', (err) => {
        console.log(err);
    });
};

export default bootstrap;