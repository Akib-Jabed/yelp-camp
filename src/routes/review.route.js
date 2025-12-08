const express = require('express');
const { checkLogin } = require('../middlewares/auth');
const { reviewController } = require('../controllers');
const validate = require('../middlewares/validate');
const { reviewValidation } = require('../validations');
const { campgroundValidation } = require('../validations');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(checkLogin,
        validate({
            params: campgroundValidation.campgroundId,
            body: reviewValidation.review
        }),
        reviewController.postReview
    );

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
 *   summary: Post a review for a campground
 *   tags: [Review]
 *   security:
 *    - bearerAuth: []
 *   parameters:
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
 *        - comment
 *        - rating
 *       properties:
 *        comment:
 *         type: string
 *        rating:
 *         type: number
 *       examples:
 *        validRequest:
 *         value:
 *          comment: Fake review
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
