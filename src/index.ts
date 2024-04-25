import express from 'express';
import './data-source';
import cors from 'cors';
import { downloadAurDatabase, getAurInfo } from './curator/sources/arch_aur';
import SoftwareController from './controller/SoftwareController';
import UserController from './controller/UserController';
import AuthController from './controller/AuthController';
import { convertFromAurToDatabaseFormat } from './helpers/DatabaseHelpers';
import { isYoungerThan24Hours } from './helpers/TimeHelpers';
import { insertIntoDatabase } from './curator/sources/arch_aur';

const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

const softwareController = new SoftwareController();
const userController = new UserController();
const authController = new AuthController();

app.get('/', (_req, res) => {
  try {
    res.json({ message: 'If you can read this the backend is running' });
  } catch (error) {
    console.error('Error loading backend: ', error);
  }
});

app.get('/software/info/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const response = await softwareController.getByName(name);
    res.json(response);
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
});

app.get('/software/all', async (_req, res) => {
  try {
    const response = await softwareController.getAll();
    res.json(response);
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
});

app.get('/software/allsources', async (_req, res) => {
  try {
    const response = await softwareController.getAllWithSources();
    res.json(response);
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
});

app.get('/search/', async (_req, res) => {
  res.json('No search query provided');
});

app.get('/search/:query', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
});

// app.get('/find', async (req, res) => {
//   try {
//     const userAgent = req.headers['user-agent'];

//     const response = await validateUserAgent(userAgent);
//     res.json(response);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// });

app.get('/sync', async (_req, res) => {
  try {
    await downloadAurDatabase();
    res.json('Database synced with AUR');
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
});

//AUR info endpoint
app.get('/info/aur/:name', async (req, res) => {
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
});

app.post('/register', async (req, res) => {
  try {
    const user = await userController.create({
      email: req.body.email,
      password: await authController.hashPassword(req.body.password),
    });
    res.json(user);
  } catch (error) {
    console.error('Error: ', error);
    res.status(400).json({ error: 'Error registering user' });
  }
});

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
