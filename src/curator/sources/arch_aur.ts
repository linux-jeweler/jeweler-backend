import axios from 'axios';
import '../../data-source';
import fs from 'fs';
import path from 'path';
import SoftwareController from '../../controller/SoftwareController';
import { checkRecentFileExists } from '../../helpers/FileHelpers';
import { getTodaysDate, isYoungerThan24Hours } from '../../helpers/TimeHelpers';
import {
  SoftwareSourceData,
  AurPackageInfo,
  hasBeenModified,
} from '../../helpers/DatabaseHelpers';

const today = getTodaysDate();
const filePath = path.join(__dirname + '/aurDataSync_' + today + '.json');

const softwareController = new SoftwareController();

const SYNC_INTERVAL = process.env.SYNC_INTERVAL || '1440';
export const ARCH_AUR = 'https://aur.archlinux.org';

//takes package name as input and returns package info from AUR
export const requestSinglePackageFromAur = async (name: string) => {
  try {
    const response = await axios.get(ARCH_AUR + '/rpc/v5' + '/info/' + name);

    //if exactly one result is found, return it. Otherwise, return null
    if (response.data?.resultcount == 1) {
      return response.data?.results[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting AUR Info: ', error);
  }
};

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
    console.error('Error performing search: ', error);
  }
}

export async function syncDatabaseWithAur2() {
  try {
    const updatedAurDatabase = await downloadFile();
    const currentDatabase = await softwareController.getAll();
    const toBeUpdated = [];
    const toBeDeleted = [];

    //if aurDatabaseSnapshot or currentDatabase is null, return
    if (!updatedAurDatabase || !currentDatabase) {
      return;
    }

    //iterate over all entries in the database
    for (const databaseEntry of currentDatabase) {
      //if entry in the AUR database has been modified, add it to the list of entries to be updated
      if (
        !updatedAurDatabase.find((entry) =>
          hasBeenModified(entry, databaseEntry)
        )
      ) {
        toBeUpdated.push(databaseEntry);
      }

      //if database entry is no longer in the AUR database, add it to the list of entries to be deleted
      if (
        !updatedAurDatabase.find((entry) => entry.Name === databaseEntry.name)
      ) {
        toBeDeleted.push(databaseEntry);
      }

      //delete all entries to be deleted from the database
      for (const entry of toBeDeleted) {
        await softwareController.deleteSource(entry.name, 'aur');
      }
    }
  } catch (error) {
    console.error('Error syncing with AUR database: ', error);
  }
}

//downloads a snapshot of the whole AUR database
//writes it into a file and immediately reads it to prevent ENAMETOOLONG error
// export async function downloadAurDatabase() {
//   var aurDatabaseSnapshot = null;

//   try {
//     //if no recent file exists, download the database snapshot
//     if ((await checkRecentFileExists(filePath)) == false) {
//       const response = await axios.get(
//         ARCH_AUR + '/packages-meta-ext-v1.json.gz',
//         { responseType: 'blob' }
//       );

//       //write response to file and change file ending to json
//       fs.writeFile(filePath, response.data, (error) => {
//         if (error) {
//           console.error('Error writing file: ' + error.code);
//           return null;
//         }
//       });
//     } else {
//       console.log('File already exists');
//       return null;
//     }

//     //read written file
//     fs.readFile(filePath, 'utf-8', (error, data) => {
//       const snapshot = JSON.parse(data);

//       if (error) {
//         console.error('Error writing file: ' + error.code);
//         return null;
//       }

//       return snapshot;
//     });
//   } catch (error) {
//     console.error('Error downloading AUR database: ', error);
//   }
// }

async function downloadFile(): Promise<AurPackageInfo[] | undefined> {
  try {
    if (await checkRecentFileExists(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      console.log('File already exists');
      return data;
    }

    const response = await axios({
      method: 'GET',
      url: ARCH_AUR + '/packages-meta-ext-v1.json.gz',
      responseType: 'stream',
    });

    // Create a write stream to save the file
    const writer = fs.createWriteStream(filePath);

    // Pipe the data to the file
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        resolve(data);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading the file:', error);
  }
}

//setInterval(syncDatabaseWithAur, parseInt(SYNC_INTERVAL) * 60 * 1000);
