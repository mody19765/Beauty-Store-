module.exports = {
 secret: process.env.JWT_SECRET || 'mo',
 expiresIn: '1h' // token expiration time
};
