import SoftwareController from '../controller/SoftwareController';
import {
  SoftwareSourceData,
  convertFromAurToDatabaseFormat,
} from '../helpers/DatabaseHelpers';
import { requestSinglePackageFromAur } from './sources/arch_aur';
import { isYoungerThan24Hours } from '../helpers/TimeHelpers';

const softwareController = new SoftwareController();

//takes in a package name and if not in database checks available sources for package info
export async function getGeneralPackageInfo(name: string) {
  if (await softwareController.getByName(name)) {
    return softwareController.getByName(name);
  }
  if (await requestSinglePackageFromAur(name)) {
    return requestSinglePackageFromAur(name);

    /*
    Once more sources have been added, additional checks will go here

*/
  } else {
    return null;
  }
}

export const getAurPackageInfo = async (
  name: string
): Promise<SoftwareSourceData | undefined> => {
  try {
    const databaseResult = await softwareController.getByName(name);

    //Todo: Move this logic to a service to be called from multiple endpoints

    //If software is in database and entry is younger than 24 hours, return it
    if (databaseResult && isYoungerThan24Hours(databaseResult.updatedAt)) {
      return convertFromAurToDatabaseFormat(databaseResult);

      //If software is not in database or older than 24 hours check AUR by calling getAurInfo
    } else {
      const aurResult = await requestSinglePackageFromAur(name);
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
        return databasePayload;

        //If software is neither in database nor in AUR return not found
      } else {
        return undefined;
      }
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
};

//Takes in a single json object and inserts it into the database
export async function insertIntoDatabase(objectToInsert: SoftwareSourceData) {
  //insert or update software into database
  await softwareController.upsert(objectToInsert);
}
