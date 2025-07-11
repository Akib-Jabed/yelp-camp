const express = require('express');
const { authController } = require('../controllers');
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);

module.exports = router;

/**
 * swagger
 * tags:
 *  name: Auth
 *  description: User Authentication | Authorization
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *   summary: Register a new user
 *   description: Create a new user account with the provided details
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - username
 *        - email
 *        - password
 *        - confirmPassword
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user.
 *        email:
 *         type: string
 *         format: email
 *         description: Email of the user. Must be unique.
 *        password:
 *         type: string
 *         format: password
 *         minLength: 8
 *         pattern: "[A-Za-z0-9]{8,}"
 *         description: Password for the user. Must be 8 characters long and contain alpha numeric values
 *        confirmPassword:
 *         type: string
 *         format: password
 *         minLength: 8
 *         pattern: "[A-Za-z0-9]{8,}"
 *         description: Repeat password and both password should match
 *     examples:
 *      validRequest:
 *       value:
 *        username: fake_name
 *        email: fake@example.com
 *        password: Password1
 *        confirmPassword: Password1
 *   responses:
 *    "201":
 *     description: User created successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         user:
 *          $ref: '#/components/schemas/User'
 *         token:
 *          $ref: '#/components/schemas/Token'
 *    "400":
 *     $ref: '#/components/responses/InvalidInput'
 *    "409":
 *     $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *   summary: User login
 *   description: Authenticate user and provide further permission
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - email
 *        - password
 *       properties:
 *        email:
 *         type: string
 *         format: email
 *         description: Email of the user
 *        password:
 *         type: string
 *         format: password
 *         description: Password of the user
 *     examples:
 *      validRequest:
 *       value:
 *        email: fake@example.com
 *        password: Password1
 *   responses:
 *    "200":
 *     description: User login successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         user:
 *          $ref: '#/components/schemas/User'
 *         token:
 *          $ref: '#/components/schemas/Token'
 *    "400":
 *     $ref: '#/components/responses/InvalidInput'
 *    "401":
 *     description: Invalid credentials
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *       example:
 *        code: 401
 *        message: Invalid credentials
 */
