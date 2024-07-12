import express from 'express' 
import bootstrap from './app.js'; 

const server = express();
bootstrap(server)  

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`server running on port ${port}`))  
