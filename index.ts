import 'dotenv/config';
import https from 'https';
import fs from 'fs';
import app from './app.ts';
import logger from './src/common/logger.ts';

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
    app.listen(PORT, () => {
        logger.info(`Server is running on https://localhost:${PORT}`);
    });
} else {
    const options = {
        key: fs.readFileSync('./certs/localhost+2-key.pem'),
        cert: fs.readFileSync('./certs/localhost+2.pem')
    };
    
    https.createServer(options, app).listen(PORT, () => {
        logger.info(`Server is running on https://localhost:${PORT}`);
    });
}

