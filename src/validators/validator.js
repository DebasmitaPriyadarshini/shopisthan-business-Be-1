const { check, validationResult } = require("express-validator");


exports.validateSigninRequest = [
    check('loginId', 'Mobile number should contains 10 digits')
        .trim()
        .isInt()
        .isLength({ min: 10, max: 10 })
];



exports.validateVerifiySigninRequest = [
    check('loginId', 'Mobile number should contains 10 digits')
        .trim()
        .isInt()
        .isLength({ min: 10, max: 10 }),
    check('otp', 'OTP number should contains 6 digits')
        .trim()
        .isInt()
        .isLength({ min: 6, max: 6 }),
];


exports.validateCatalogRequest = [
    check('name', 'Catalog name should not be more than 20 char.')
        .isLength({ max: 30 })
];


exports.validateCreateFreeOnlineStoreRequest = [
    check('loginId', 'Mobile number should contains 10 digits')
        .trim()
        .isInt()
        .isLength({ min: 10, max: 10 }),
    check('storeName', 'invalid store name')
        .isLength({ max: 50 }),
    check('storeCategory', 'invalid store category')
        .isLength({ max: 50 })
]


exports.isRequestVaildated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    next();
};
