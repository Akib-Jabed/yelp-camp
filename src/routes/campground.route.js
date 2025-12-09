const express = require('express');
const { checkLogin } = require('../middlewares/auth');
const { campgroundController } = require('../controllers');
const validate = require('../middlewares/validate');
const { campgroundValidation } = require('../validations');
const { uploader, uploadToCloudinary } = require('../middlewares/fileUploader');

const router = express.Router();
const upload = uploader();

router
    .route('/')
    .get(campgroundController.getCampgrounds)
    .post(
        checkLogin,
        upload.array('images'),
        uploadToCloudinary,
        validate({ body: campgroundValidation.campground }),
        campgroundController.createCampground
    );

router
    .route('/:campgroundId')
    .get(
        validate({ params: campgroundValidation.campgroundId }),
        campgroundController.getCampground
    )
    .put(
        checkLogin,
        upload.array('images'),
        uploadToCloudinary,
        validate({
            params: campgroundValidation.campgroundId,
            body: campgroundValidation.campground
        }),
        campgroundController.updateCampground
    )
    .delete(
        checkLogin,
        validate({ params: campgroundValidation.campgroundId }),
        campgroundController.deleteCampground
    );

module.exports = router;

/**
 * swagger
 * tags:
 *  name: Campground
 */

/**
 * @swagger
 * /campgrounds:
 *  get:
 *   summary: Get all campgrounds
 *   tags: [Campground]
 *   parameters:
 *    - name: title
 *      in: query
 *      description: campground title
 *      required: false
 *      schema:
 *       type: string
 *       example: fake
 *    - name: location
 *      in: query
 *      description: campground location
 *      required: false
 *      schema:
 *       type: string
 *       example: fake location
 *    - name: sort
 *      in: query
 *      description: sort campground data based on field
 *      required: false
 *      schema:
 *       type: string
 *       example: "-price"
 *       default: "-createdAt"
 *    - name: page
 *      in: query
 *      description: the page number
 *      required: false
 *      schema:
 *       type: number
 *       minimum: 1
 *       default: 1
 *       example: 2
 *    - name: limit
 *      in: query
 *      description: number of campground data to get
 *      required: false
 *      schema:
 *       type: integer
 *       minimum: 1
 *       default: 10
 *       example: 50
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
 *           $ref: '#/components/schemas/Campground'
 */

/**
 * @swagger
 * /campgrounds:
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
 *    "409":
 *     $ref: '#/components/responses/TitleConflict'
 */

/**
 * @swagger
 * /campgrounds/{id}:
 *  get:
 *   summary: Get a campground information
 *   tags: [Campground]
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
 * /campgrounds/{id}:
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
 *    "409":
 *     $ref: '#/components/responses/TitleConflict'
 */

/**
 * @swagger
 * /campgrounds/{id}:
 *  delete:
 *   summary: Delete a campground along with all associated reviews.
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
