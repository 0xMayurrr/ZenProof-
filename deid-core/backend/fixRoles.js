require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const result = await mongoose.connection.collection('users').updateMany(
        { role: { $nin: ['user', 'issuer'] } },
        [{ $set: { role: { $toLower: '$role' } } }]
    );
    console.log(`Fixed ${result.modifiedCount} users`);

    // Any still invalid (e.g. 'admin' not in enum) — set to 'user'
    await mongoose.connection.collection('users').updateMany(
        { role: { $nin: ['user', 'issuer', 'admin'] } },
        { $set: { role: 'user' } }
    );

    mongoose.disconnect();
});
