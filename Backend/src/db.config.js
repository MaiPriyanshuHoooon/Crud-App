const { default: mongoose } = require("mongoose")

exports.ConnectDB = async() => {
    try {
        if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set');
        const db = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected successfully with ${db.connection.host}`.bgMagenta);


    } catch (error) {
        // console.error('Mongo connect error:', error.name, error.message);
        await mongoose.disconnect()
        process.exit(1)
    }
}