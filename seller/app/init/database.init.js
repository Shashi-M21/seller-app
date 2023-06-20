import mongoose from 'mongoose';
import { mergedEnvironmentConfig } from '../config/env.config.js';

// const config = mergedEnvironmentConfig.mongodb;
// mongoose.connect(`mongodb://${config.host}/${config.name}`,{
//     useNewUrlParser:true
// });


mongoose.connect(`mongodb+srv://shashi:hAeVch1QroPJ8J9B@cluster0.m4hqvzp.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true
});

mongoose.set('strictQuery', false);

mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(`[MONGOOS]:${collectionName}.${method}`, JSON.stringify(query), doc);
});

