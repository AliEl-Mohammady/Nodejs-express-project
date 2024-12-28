const { body } = require('express-validator'); //>>>>>express validator for validation (middleware)

const validationSchema = () => {
    return [
        body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('price').isNumeric().withMessage('Price must be a number')
    ]
    
}

module.exports = validationSchema