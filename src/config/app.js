import bodyParser from 'body-parser';
import cors from 'cors';

import routes from '../routes';
import errors from '../errors';

export default (app) => {
  const PORT = process.env.PORT || 4000;

  app.enable('trust proxy');
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(routes);
  app.use(errors);
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};
