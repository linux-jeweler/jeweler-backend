import express from 'express';
import './data-source';
import cors from 'cors';
import expressAsyncHandler from 'express-async-handler';
import { validateRequest } from 'zod-express-middleware';
import { zodSchema } from './controller/AuthController';
import { getAurInfo, syncDatabaseWithAur2 } from './curator/sources/arch_aur';
import SoftwareController from './controller/SoftwareController';
import UserController from './controller/UserController';
import AuthController from './controller/AuthController';
import { convertFromAurToDatabaseFormat } from './helpers/DatabaseHelpers';
import { isYoungerThan24Hours } from './helpers/TimeHelpers';
import { insertIntoDatabase } from './curator/sources/arch_aur';
import { auth } from './middleware/auth';

const port = process.env.PORT || 3001;
const app = express();
const asyncHandler = expressAsyncHandler;

app.use(express.json());
app.use(cors());

const softwareController = new SoftwareController();
const userController = new UserController();
const authController = new AuthController();

app.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({ message: 'If you can read this the backend is running' });
  })
);

app.get(
  '/software/info/:name',
  asyncHandler(async (req, res) => {
    const name = req.params.name;
    const response = await softwareController.getByName(name);
    res.json(response);
  })
);

app.get(
  '/software/all',
  asyncHandler(async (_req, res) => {
    const response = await softwareController.getAll();
    res.json(response);
  })
);

app.get(
  '/software/allsources',
  asyncHandler(async (_req, res) => {
    const response = await softwareController.getAllWithSources();
    res.json(response);
  })
);

app.get(
  '/search/',
  asyncHandler(async (_req, res) => {
    res.json('No search query provided');
  })
);

app.get(
  '/search/:query',
  asyncHandler(async (req, res) => {
    if (!req.params.query) {
      res.json('No search query provided');
      return;
    }

    const query = req.params.query;

    if (query.length < 3) {
      res.json('Search query too short');
      return;
    }

    const response = await softwareController.getManyByName(query);

    if (Array.isArray(response) && response.length === 0) {
      res.json('No software found');
      return;
    }

    res.json(response);
  })
);

// app.get('/find', async (req, res) => {
//   try {
//     const userAgent = req.headers['user-agent'];

//     const response = await validateUserAgent(userAgent);
//     res.json(response);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// });

app.post(
  '/aur/sync',
  asyncHandler(async (_req, res) => {
    await syncDatabaseWithAur2();
    res.json('Database synced with AUR');
  })
);

//AUR info endpoint
app.get(
  '/aur/info/:name',
  asyncHandler(async (req, res) => {
    try {
      const name = req.params.name;
      const databaseResult = await softwareController.getByName(name);

      //Todo: Move this logic to a service to be called from multiple endpoints

      //If software is in database and entry is younger than 24 hours, return it
      if (databaseResult && isYoungerThan24Hours(databaseResult.updatedAt)) {
        res.json(databaseResult);

        //If software is not in database or older than 24 hours check AUR by calling getAurInfo
      } else {
        const aurResult = await getAurInfo(name);

        //If software is in AUR add it to the database and return it
        if (aurResult) {
          const databasePayload = convertFromAurToDatabaseFormat(aurResult);
          await insertIntoDatabase(databasePayload);

          //Todo: If software is in database but older than 24 hours update it

          //Return the software from the database
          // const response = await softwareController.getByName(
          //   databasePayload.softwareData.name
          // );

          // res.json(response);
          res.json(databasePayload.softwareData);

          //If software is neither in database nor in AUR return not found
        } else {
          res.json('No software found');
        }
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  })
);

app.get(
  '/user/:id',
  [auth],
  asyncHandler(async (req, res) => {
    const user = await userController.getById(req.params.id);
    res.json(user);
  })
);

app.post(
  '/register',
  validateRequest({ body: zodSchema }),
  asyncHandler(async (req, res) => {
    if (await userController.getByEmail(req.body.email)) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const user = await userController.create({
      email: req.body.email,
      password: await authController.hashPassword(req.body.password),
    });
    res.json(user);
  })
);

app.post('/login', async (req, res) => {
  try {
    const user = await userController.getByEmail(req.body.email);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (await authController.verifyPassword(req.body.password, user.password)) {
      res.status(200).json({
        status: 'success',
        message: 'User logged in',
        token: authController.generateJWT(user.id),
      });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(400).json({ error: 'Error logging in' });
  }
});

app.listen(port, () => {
  console.log(`App running on Port ${port}`);
});
