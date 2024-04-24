import express from 'express';
import './data-source';
import cors from 'cors';
import { getAurInfo } from './curator/sources/arch_aur';
import SoftwareController from './controller/SoftwareController';
import { convertFromAurToDatabaseFormat } from './helpers/DatabaseFormatter';
import { isYoungerThan24Hours } from './helpers/TimeHelpers';

const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

const softwareController = new SoftwareController();

app.get('/', (_req, res) => {
  res.json({ message: 'If you can read this the backend is running' });
});

app.get('/search/', (_req, res) => {
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
    console.error('Error fetching data:', error);
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
        await softwareController.create(databasePayload.softwareData);

        //Todo: If software is in database but older than 24 hours update it

        //Return the software from the database
        const response = await softwareController.getByName(
          databasePayload.softwareData.name
        );

        res.json(response);

        //If software is neither in database nor in AUR return not found
      } else {
        res.json('No software found');
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

//Return all software in the database
app.get('/all', async (_req, res) => {
  const softwareController = new SoftwareController();
  const response = await softwareController.getAll();
  res.json(response);
});
/*

PACKAGE SEARCH ENDPOINT

takes input from search query
returns a list of packages that match the search query from unified package database
if there are no matching packages perform search query on source APIs

query database with search string



*/

app.listen(port, () => {
  console.log(`App running on Port ${port}`);
});
