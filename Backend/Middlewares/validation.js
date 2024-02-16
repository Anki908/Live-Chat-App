const mongoose = require('mongoose');

const { body , validationResult , param } = require('express-validator')

const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req , res , next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errorMessages = errors.array().map((error) => error.msg);
                //console.log(errorMessages[0]);
                throw new Error(errorMessages[0]);
            }
            next();
        }
    ]
}

exports.validateSignUp = withValidationErrors([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('Please write correct email'),
    body('password').notEmpty().withMessage('password is required').isLength({min: 8}).withMessage('please provide password of minimum 8 chars')
])