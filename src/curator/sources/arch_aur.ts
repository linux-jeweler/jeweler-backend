import axios from 'axios';
import '../../data-source';
import fs from 'fs';
import path from 'path';
import { checkRecentFileExists } from '../../helpers/FileHelpers';
import { getTodaysDate } from '../../helpers/TimeHelpers';

const outputPath = path.join(__dirname);

const SYNC_INTERVAL = process.env.SYNC_INTERVAL || '1440';
export const ARCH_AUR = 'https://aur.archlinux.org';

//takes package name as input and returns package info from AUR
export async function getAurInfo(name: string) {
  try {
    const response = await axios.get(ARCH_AUR + '/rpc/v5' + '/info/' + name);

    //if exactly one result is found, return it. Otherwise, return null
    if (response.data?.resultcount == 1) {
      return response.data?.results[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//takes search query as input and returns list of packages from AUR
export async function performAurSearch(query: string) {
  const results = [];
  try {
    const response = await axios.get(ARCH_AUR + '/search/' + query);
    //if results are found, return them as an array. Otherwise, return null
    if (response.data?.resultcount > 0) {
      for (const result of response.data?.results) {
        results.push(result);
      }
    } else {
      return null;
    }
    return response.data?.results;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//downloads a snapshot of the whole AUR database
//writes it into a file and immediately reads it to prevent ENAMETOOLONG error
export async function downloadAurDatabase() {
  try {
    //fetch database snapshot if not already there

    console.log(
      await checkRecentFileExists(
        outputPath + '/aurDataSync_' + getTodaysDate + '.json'
      )
    );

    // const response = await axios.get(
    //   ARCH_AUR + '/packages-meta-ext-v1.json.gz',
    //   { responseType: 'blob' }
    // );

    // //write response to file and change file ending to json
    // fs.writeFile(
    //   outputPath + '/aurDataSync_' + today + '.json',
    //   response.data,
    //   (error) => {
    //     if (error) {
    //       console.error('Error writing file: ' + error.code);
    //       return null;
    //     }
    //   }
    // );

    //read written file
    fs.readFile(
      outputPath + '/aurDataSync_' + getTodaysDate + '.json',
      'utf8',
      (error, data) => {
        if (error) {
          console.error('Error reading file: ' + error.code);
          return null;
        }

        const aurDatabaseSnapshot = JSON.parse(data);
        return aurDatabaseSnapshot;
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//setInterval(syncDatabaseWithAur, parseInt(SYNC_INTERVAL) * 60 * 1000);
