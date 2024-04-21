import express from 'express';
import axios from 'axios';
import './data-source';
import cors from 'cors';
import { getAurInfo } from './curator/sources/arch_aur';
import SoftwareController from './controller/SoftwareController';
import { convertFromAurToDatabaseFormat } from './middleware/DatabaseFormatter';

const port = process.env.PORT || 3001;
const app = express();
const router = express.Router();
const aurRoutes = require('./curator/sources/arch_aur');

app.use(express.json());
app.use(cors());
app.use(router);

app.get('/', (_req, res) => {
  res.json({ message: 'If you can read this the backend is running' });
});

app.get('/aur/info/:name', async (req, res) => {
  try {
    const softwareController = new SoftwareController();

    const name = req.params.name;
    const databaseResult = await softwareController.getByName(name);

    //If software is in database return it
    if (databaseResult) {
      console.log('Software found in database');
      res.json(databaseResult);

      //If software is not in database check AUR by calling getAurInfo
    } else {
      console.log('Not in database, checking AUR');
      const aurResult = await getAurInfo(name);

      //If software is in AUR add it to the database and return it
      if (aurResult) {
        console.log('Software found in AUR');
        const databasePayload = convertFromAurToDatabaseFormat(aurResult);
        await softwareController.create(databasePayload);

        res.json(databasePayload);

        //If software is neither in database nor in AUR return not found
      } else {
        res.json('No software found');
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
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
