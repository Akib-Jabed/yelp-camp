const express = require('express');
const { checkLogin } = require('../middlewares/auth');
const { reviewController } = require('../controllers');
const validate = require('../middlewares/validate');
const { reviewValidation } = require('../validations');

const router = express.Router();

router.route('/').post(checkLogin, validate(reviewValidation.review), reviewController.postReview);

router
    .route('/:reviewId')
    .put(checkLogin, validate(reviewValidation.review), reviewController.updateReview)
    .delete(checkLogin, reviewController.deleteReview);

module.exports = router;

/**
 * swagger
 * tags:
 *  name: Review
 */

/**
 * @swagger
 * /campgrounds/{campgroundId}/reviews:
 *  post:
 *   summary: Post a review
 *   tags: [Review]
 *   security:
 *    - bearerAuth: []
 *   paramters:
 *    - name: campgroundId
 *      in: path
 *      required: true
 *      description: The unique identifier of a campground
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - body
 *        - rating
 *       properties:
 *        body:
 *         type: string
 *        rating:
 *         type: number
 *       examples:
 *        validRequest:
 *         value:
 *          body: Fake review
 *          rating: 5
 *   responses:
 *    "201":
 *     description: review cerated successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Review'
 *    "400":
 *     $ref: '#/components/responses/InvalidInput'
 *    "401":
 *     $ref: '#/components/responses/Unauthorized'
 *    "404":
 *     $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /campgrounds/{campgroundId}/reviews/{reviewId}:
 *  put:
 *   summary: Update a review
 *   tags: [Review]
 *   security:
 *    - bearerAuth: []
 *   paramters:
 *    - name: campgroundId
 *      in: path
 *      required: true
 *      description: The unique identifier of a campground
 *      schema:
 *       type: string
 *    - name: reviewId
 *      in: path
 *      required: true
 *      description: The unique identifier of a review
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - body
 *        - rating
 *       properties:
 *        body:
 *         type: string
 *        rating:
 *         type: number
 *       examples:
 *        validRequest:
 *         value:
 *          body: Fake review
 *          rating: 5
 *   responses:
 *    "200":
 *     description: review updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Review'
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
 * /campgrounds/{campgroundId}/reviews/{reviewId}:
 *  delete:
 *   summary: Delete a review
 *   tags: [Review]
 *   security:
 *    - bearerAuth: []
 *   paramters:
 *    - name: campgroundId
 *      in: path
 *      required: true
 *      description: The unique identifier of a campground
 *      schema:
 *       type: string
 *    - name: reviewId
 *      in: path
 *      required: true
 *      description: The unique identifier of a review
 *      schema:
 *       type: string
 *   responses:
 *    "204":
 *     description: No content
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Review'
 *    "401":
 *     $ref: '#/components/responses/Unauthorized'
 *    "403":
 *     $ref: '#/components/responses/Forbidden'
 *    "404":
 *     $ref: '#/components/responses/NotFound'
 */
