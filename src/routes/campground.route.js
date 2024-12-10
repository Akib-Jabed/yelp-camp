const express = require('express');
const { checkLogin } = require('../middlewares/auth');
const { campgroundController } = require('../controllers');
const validate = require('../middlewares/validate');
const { campgroundValidation } = require('../validations');
const { uploader, generateThumb } = require('../middlewares/fileUploader');

const router = express.Router();
const upload = uploader();

router
    .route('/')
    .get(campgroundController.getCampgrounds)
    .post(
        checkLogin,
        upload.array('images'),
        generateThumb,
        validate(campgroundValidation.campground),
        campgroundController.createCampground
    );

router
    .route('/:id')
    .get(campgroundController.getCampground)
    .put(
        checkLogin,
        upload.array('images'),
        generateThumb,
        validate(campgroundValidation.campground),
        campgroundController.updateCampground
    )
    .delete(checkLogin, campgroundController.deleteCampground);

module.exports = router;

/**
 * swagger
 * tags:
 *  name: Campground
 */

/**
 * @swagger
 * /campground:
 *  post:
 *   summary: Create a campground
 *   tags: [Campground]
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - location
 *        - price
 *        - images
 *       properties:
 *        title:
 *         type: string
 *        description:
 *         type: string
 *        location:
 *         type: string
 *        price:
 *         type: number
 *        images:
 *         type: array
 *         items:
 *          type: string
 *          format: binary
 *       examples:
 *        validRequest:
 *         value:
 *          title: Fake Title
 *          description: Fake description
 *          location: Fake location
 *          price: 100
 *          images: []
 *   responses:
 *    "201":
 *     description: Campground cerated successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Campground'
 *    "400":
 *     $ref: '#/components/responses/InvalidInput'
 *    "401":
 *     $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /campground/{id}:
 *  get:
 *   summary: Get a campground information
 *   tags: [Campground]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: The unique identifier of a campground
 *      schema:
 *       type: string
 *   responses:
 *    "200":
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Campground'
 *    "404":
 *     $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /campground/{id}:
 *  put:
 *   summary: Update a campground
 *   tags: [Campground]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: The unique identifier of a campground
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - location
 *        - price
 *        - images
 *       properties:
 *        title:
 *         type: string
 *        description:
 *         type: string
 *        location:
 *         type: string
 *        price:
 *         type: number
 *        images:
 *         type: array
 *         items:
 *          type: string
 *          format: binary
 *       examples:
 *        validRequest:
 *         value:
 *          title: Fake Title
 *          description: Fake description
 *          location: Fake location
 *          price: 100
 *          images: []
 *   responses:
 *    "200":
 *     description: Campground updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Campground'
 *    "400":
 *     $ref: '#/components/responses/InvalidInput'
 *    "401":
 *     $ref: '#/components/responses/Unauthorized'
 *    "403":
 *     $ref: '#/components/responses/Forbidden'
 *    "404":
 *     $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /campground/{id}:
 *  delete:
 *   summary: Delete a campground
 *   tags: [Campground]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: The unique identifier of a campground
 *      schema:
 *       type: string
 *   responses:
 *    "204":
 *     description: No content
 *    "401":
 *     $ref: '#/components/responses/Unauthorized'
 *    "403":
 *     $ref: '#/components/responses/Forbidden'
 *    "404":
 *     $ref: '#/components/responses/NotFound'
 */
