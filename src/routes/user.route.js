const express = require('express');
const { userController } = require('../controllers');
const { checkLogin, verifyRole } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(checkLogin, verifyRole('admin'), userController.getUsers);

module.exports = router;

/**
 * swagger
 * tags:
 *  name: User
 *  description: User information
 */

/**
 * @swagger
 * /users:
 *  get:
 *   summery: Get all users
 *   description: Only admin can get all users
 *   tags: [Users]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: firstName
 *      schema:
 *       type: string
 *      description: User first name
 *    - in: query
 *      name: lastName
 *      schema:
 *       type: string
 *      description: User last name
 *    - in: query
 *      name: email
 *      schema:
 *       type: string
 *      description: User email
 *    - in: query
 *      name: role
 *      schema:
 *       type: string
 *      description: User role
 *    - in: query
 *      name: sortBy
 *      schema:
 *       type: string
 *      description: Sort by this specific field in asc/desc order
 *    - in: query
 *      name: limit
 *      schema:
 *       type: integer
 *       minimum: 1
 *      default: 10
 *      description: Maximum number of users
 *    - in: query
 *      name: page
 *      schema:
 *       type: integer
 *       minimum: 1
 *       default: 1
 *      description: Page number
 *   responses:
 *    "200":
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         results:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/User'
 *         page:
 *          type: integer
 *          example: 1
 *         limit:
 *          type: integer
 *          example: 10
 *         totalPages:
 *          type: integer
 *          example: 1
 *         totalResults:
 *          type: integer
 *          example: 1
 */
