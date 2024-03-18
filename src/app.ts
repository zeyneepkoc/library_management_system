
import express from 'express';
import bodyParser from 'body-parser';
import routes from '../src/routes/routes';
import { debug } from 'console';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
