import express from 'express';
import './data-source';
import cors from 'cors';
import dayjs from 'dayjs';
import 'dayjs/plugin/relativeTime';
import { getAurInfo } from './curator/sources/arch_aur';
import SoftwareController from './controller/SoftwareController';
import { convertFromAurToDatabaseFormat } from './helpers/DatabaseFormatter';
import { isYoungerThan24Hours } from './helpers/TimeHelpers';
import e from 'express';

const port = process.env.PORT || 3001;
const app = express();
const router = express.Router();

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
app.use(express.json());
app.use(cors());
app.use(router);

app.get('/', (_req, res) => {
  res.json({ message: 'If you can read this the backend is running' });
});

//AUR info endpoint
app.get('/aur/info/:name', async (req, res) => {
  try {
    const softwareController = new SoftwareController();

    const name = req.params.name;
    const databaseResult = await softwareController.getByName(name);

    //Todo: Move this logic to a service to be called from multiple endpoints

    //If software is in database and entry is younger than 24 hours, return it
    if (databaseResult && isYoungerThan24Hours(databaseResult.lastRequested)) {
      res.json(databaseResult);

      //If software is not in database or older than 24 hours check AUR by calling getAurInfo
    } else {
      const aurResult = await getAurInfo(name);

      //If software is in AUR add it to the database and return it
      if (aurResult) {
        const databasePayload = convertFromAurToDatabaseFormat(aurResult);
        await softwareController.create(databasePayload);

        //Todo: If software is in database but older than 24 hours update it

        //Return the software from the database
        const response = await softwareController.getByName(
          databasePayload.name
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

module.exports = router;
