import Contacts from '../models/Contacts';
import Events from '../models/Events';
import Publications from '../models/Publications';
import Subscribers from '../models/Subscribers';
import User from '../models/User';
import VerificationCode from '../models/VerificationCode';
import { parallelRequests } from './util';

const empytModel = (model) => model.deleteMany({});

export default async () => {
  await parallelRequests(
    [empytModel, User],
    [empytModel, Contacts],
    [empytModel, Events],
    [empytModel, Publications],
    [empytModel, Subscribers],
    [empytModel, VerificationCode]
  );
};
