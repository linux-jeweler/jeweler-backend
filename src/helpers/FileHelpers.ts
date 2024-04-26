import fs from 'fs';
import { getTodaysDate } from './TimeHelpers';

const today = getTodaysDate();

//takes in path to a file and checks if it exists and is recent
export function checkRecentFileExists(filePath: string) {
  return new Promise((resolve, _reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        //if file does not exist return false
        resolve(false);
        return;
      }
      //isolate filename from the rest of the path
      const fileName = filePath.split('/').pop();

      if (fileName) {
        //extract the date from the file name
        const dateOnly = fileName.split('_').pop()?.split('.')[0];
        //if file exists and has todays date return true, else return false
        if (dateOnly === today) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        //error splitting file name from path. this should not happen
        resolve(false);
      }
    });
  });
}
