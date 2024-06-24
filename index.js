require("dotenv").config();

import cors from "cors";
import express from "express";
import helmet from "helmet";

const worko = express();
const port = process.env.PORT || 4000;

//API
import Auth from "./API/Auth";

//Database connection
import ConnectDB from "./database/connection";

worko.use(express.json()); 
worko.use(express.urlencoded({extended:false}));
worko.use(cors());
worko.use(helmet());

//For application routes
//localhost:4000/auth/signup
worko.use("/auth", Auth);

worko.get('/', (req, res) => {res.send('Setup Success Yay!!!');});


worko.listen(port, () => 
    ConnectDB().then(() => console.log(`Server running at http://localhost:${port}/`))
    .catch((error) => console.log("DB connection failed", error))
);