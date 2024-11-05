import dotenv from 'dotenv';
import app from './app.ts';
import logger from './src/common/logger.ts';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
