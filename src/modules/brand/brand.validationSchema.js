import joi from 'joi'
export const createBrandSchema = {
    body: joi
    .object({
        name: joi.string().min(2).max(20),
    })
    .required()
    .optional({presence: 'require'}),
}

export const UpdateBrandSchema = {
    body: joi
    .object({
        name: joi.string().min(2).max(20),
    })
    .required()
    .optional({presence: 'require'}),
}

