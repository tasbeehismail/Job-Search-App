import Joi from 'joi';

const applyJobSchema = Joi.object({
  jobId: Joi.string().required(),
  userTechSkills: Joi.array().items(Joi.string()).required(),
  userSoftSkills: Joi.array().items(Joi.string()).required()
});

export { applyJobSchema };
