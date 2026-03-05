import Joi from "joi";

// Register validator
const registerSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[A-Za-z ]+$/)
        .required()
        .messages({
            "string.empty": "Full name is required",
            "string.min": "Full name must be at least 3 characters",
            "string.max": "Full name must be at most 50 characters",
            "string.pattern.base":
                "Full name must contain only alphabets and spaces",
        }),

    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
    }),

    password: Joi.string()
        .min(8)
        .max(64)
        .required()
        .pattern(
            new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$"),
        )
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.pattern.base":
                "Password must contain uppercase, lowercase, number, and special character",
        }),
});

export { registerSchema };
