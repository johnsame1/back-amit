const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: '',
        publicId: null,
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Blog', BlogsSchema);
