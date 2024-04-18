import express from 'express';
import axios from 'axios';
import './data-source';
import cors from 'cors';
import { getAurInfo } from './curator/sources/arch_aur';

const port = process.env.PORT || 3001;
const app = express();
const router = express.Router();
const aurRoutes = require('./curator/sources/arch_aur');

app.use(express.json());
app.use(cors());
app.use(router);

router.use('/aur', aurRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'If you can read this the backend is running' });
});

app.get('/aur/info/:name', async (req, res) => {
  try {
    // const rawData = await axios.get(
    //   process.env.ARCH_AUR + '/info/' + req.params.name
    // );
    return;
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
