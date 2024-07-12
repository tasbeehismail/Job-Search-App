import { Router } from "express";
import userRouter from './user.routes.js';
import AppError from "../utils/appError.js";

const app = Router();

app.use('/user', userRouter);

app.use('*', (req, res, next) => {
    next (new AppError ('invalid routing path ' + req.originalUrl, 404)); 
});

export default app;