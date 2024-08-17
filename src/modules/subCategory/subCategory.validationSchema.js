import joi from 'joi'
export const createSubCategorySchema = {
    body: joi
    .object({
        name: joi.string().min(2).max(20),
    })
    .required()
    .optional({presence: 'require'}),
}

export const UpdateSubCategorySchema = {
    body: joi
    .object({
        name: joi.string().min(2).max(20),
    })
    .required()
    .optional({presence: 'require'}),
}

