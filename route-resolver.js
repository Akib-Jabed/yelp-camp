// const { to } = require('await-to-js');

// module.exports = async (callback, req, res) => {
//     const [err, response] = await to(callback(req));

//     if (err) {
//         res.status(400).send({ success: false, message: err.message });
//     } else if (!response.success) {
//         res.status(response.status ? response.status : 400).send(response);
//     } else {
//         res.status(response.status).send(response);
//     }
// };
