import Joi from 'joi';

// Create todo validation schema
export const createTodoSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty'
    }),
  
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Content must be at least 1 character long',
      'string.max': 'Content cannot exceed 1000 characters',
      'any.required': 'Content is required',
      'string.empty': 'Content cannot be empty'
    }),
  
  status: Joi.string()
    .valid('pending', 'completed')
    .default('pending')
    .messages({
      'any.only': 'Status must be either pending or completed'
    })
});

// Update todo validation schema
export const updateTodoSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 200 characters',
      'string.empty': 'Title cannot be empty'
    }),
  
  content: Joi.string()
    .min(1)
    .max(1000)
    .optional()
    .messages({
      'string.min': 'Content must be at least 1 character long',
      'string.max': 'Content cannot exceed 1000 characters',
      'string.empty': 'Content cannot be empty'
    }),
  
  status: Joi.string()
    .valid('pending', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be either pending or completed'
    })
});

// Validation middleware function
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages
      });
    }

    req.body = value;
    next();
  };
};
