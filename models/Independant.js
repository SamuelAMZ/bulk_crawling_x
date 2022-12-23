const mongoose = require("mongoose");

const independants = new mongoose.Schema({
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  website: {
    type: String,
  },
  sms: {
    type: String,
  },
  email: {
    type: String,
  },
  twitter: {
    type: String,
  },
  onlyfans: {
    type: String,
  },
  instagram: {
    type: String,
  },
  hasWebsite: {
    type: Boolean,
  },
  hasSms: {
    type: Boolean,
  },
  hasEmail: {
    type: Boolean,
  },
  images: {
    type: Array,
  },
  ownerSite: {
    type: String,
  },
  status: {
    type: String,
  },
  profileLink: {
    type: String,
  },
  needUpdate: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Independants", independants);
