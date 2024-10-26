const mongoose = require("mongoose");

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/self").then(() => {
            console.log(`Database Connected SuccessFully !!`);
        });
    } catch (error) {
        console.log(`Error in Database connection ${error}`);
    }
};

module.exports = ConnectDB;

