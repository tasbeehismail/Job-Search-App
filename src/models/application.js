import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userTechSkills: {
    type: [String],
    required: true
  },
  userSoftSkills: {
    type: [String],
    required: true
  },
  userResume: {
    type: String, // This will store the path to the uploaded PDF
    required: true
  }
}, {
  timestamps: true
});


applicationSchema.post('init', function (application) {
  application.userResume = `${process.env.BASE_URL}/uploads/${application.userResume}`
});


const Application = mongoose.model('Application', applicationSchema);

export default Application;
