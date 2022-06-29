import {faker} from "@faker-js/faker";
import express from "express";
import { generateUsers } from "./functions.js"
import bodyparser from "body-parser"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const jsonParser = bodyparser.json();
const app = express();

// Swagger

const options = {
    definition: {
        openapi: '3.0.0',
        servers: [
            {
                url: "https://efa-app.ml/mock/"
            },
            {
                url: "http://efa-app.ml/mock/"
            },
            {
                url: "https://www.efa-app.ml/mock/"
            },
            {
                url: "http://www.efa-app.ml/mock/"
            },
            {
                url: "/"
            },
        ],
        info: {
            title: 'EFA Mock API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    description: "JWT Authorization",
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    name: "Authorization",
                    bearerFormat: "JWT",
                }
            }
        },
        security: {
            bearerAuth: [],
        },
    },
    apis: ['./index.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

const forwardedPrefixSwagger = async (req, res, next) => {
    req.originalUrl = (req.headers['x-forwarded-prefix'] || '') + req.url;
    next();
};

app.use('/api-docs', forwardedPrefixSwagger, swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// ---------


const checkHeaderAuth = req => {
    if (req.header("Authorization") == "Bearer supersecretaccesstoken") return true
    else return false;
}

/**
 * @openapi
 * /all-users:
 *   get:
 *     description: Gets a list of random generated users
 *     responses:
 *       200:
 *         description: It all went well!
 *       401:
 *         description: Unauthorised
 *     security:
 *       - bearerAuth: []
 *
 */
app.get("/all-users", (req, res) => {
    if(checkHeaderAuth(req)) res.json(generateUsers());
    else {
        res.status(401);
        res.json({error: "Unauthorised"});
    }
})

/**
 * @openapi
 * /all-users/{amount}:
 *   get:
 *     description: Gets a list of random generated users
 *     parameters:
 *       - in: path
 *         name: Amount
 *         schema:
 *           type: int
 *         description: Number of users to output
 *     responses:
 *       200:
 *         description: It all went well!
 *       401:
 *         description: Unauthorised
 *     security:
 *       - bearerAuth: []
 */
app.get("/all-users/:amount", (req, res) => {
    if(checkHeaderAuth(req)) res.json(generateUsers(req.params.amount));
    else {
        res.status(401);
        res.json({error: "Unauthorised"});
    }
})

/**
 * @openapi
 * /version:
 *   get:
 *     description: API version
 *     responses:
 *       200:
 *         description: It all went well!
 *
 */
app.get("/version", (req, res) => {
    res.json({
        version : "v0.0.3"
    });
})

/**
 * @openapi
 * /:
 *   get:
 *     description: Hello from server
 *     responses:
 *       200:
 *         description: It all went well!
 *       401:
 *         description: Unauthorised1
 *     security:
 *       - bearerAuth: []
 *
 */
app.get("/", (req, res) => {
    if(checkHeaderAuth(req)) res.json({message: "Hello from mock sever!"});
    else {
        res.status(401);
        res.json({error: "Unauthorised"});
    }
})

let regUsers = [
    {
        email: "test@test.com",
        password: "1234"
    }
]

/**
 * @openapi
 * definitions:
 *   LoginDTO:
 *     required:
 *       - username
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @openapi
 * /login:
 *   post:
 *     description: Login endpoint
 *     requestBody:
 *       description: E-mail address and password
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/LoginDTO'
 *     responses:
 *       200:
 *         description:
 *
 *       401:
 *         description: Auth failed
 *
 */
app.post("/login", jsonParser, (req, res) => {
    const lookup = regUsers.filter(user => {
        if(user.email == req.body.email && user.password == req.body.password) return true;
    })

    if(lookup.length == 1)
        res.json({token: "Bearer "+"supersecretaccesstoken"})
    else {
        res.status(401)
        res.json({error: "Authentication failed"})
    }
})

/**
 * @openapi
 * definitions:
 *   RegisterDTO:
 *     required:
 *       - username
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @openapi
 * /register:
 *   post:
 *     description: Register endpoint
 *     requestBody:
 *       description: E-mail address and password
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/RegisterDTO'
 *     responses:
 *       200:
 *         description:
 *
 *       403:
 *         description: User already registered
 *
 */
app.post("/register", jsonParser, (req, res) => {
    console.log(req.body)
    const lookup = regUsers.filter(user => {
       if(user.email === req.body.email) return true;
    })
    if (lookup.length > 0) {
        res.status(403)
        res.json({error:"User already registered"})
    }
    else {
        const addedUser = {
            email: req.body.email,
            password: req.body.password
        }
        if(addedUser.password !== "" && addedUser.password !== undefined && addedUser.password !== null) {
            regUsers.push(addedUser);
            res.json({message:"User registered succesfuly"});
        }
    }

});

app.listen(3000, () => console.log('Example app is listening on port http://localhost:3000.'));






