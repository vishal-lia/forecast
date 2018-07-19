let env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    let config = require('./config.json');

    Object.keys(config).forEach(key => {
        process.env[key] = config[key];
    });
}