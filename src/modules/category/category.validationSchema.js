import joi from 'joi'
export const createCategorySchema = {
    body: joi
    .object({
        name: joi.string().min(2).max(20),
    })
    .required()
    .optional({presence: 'require'}),
}

export const updateCategorySchema = {
    body: joi
    .object({
        name: joi.string().min(2).max(20).optional(),
    })
    .required()
}

