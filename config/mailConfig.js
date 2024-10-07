module.exports = {
  service: 'Gmail', // or any email service you're using
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
};
