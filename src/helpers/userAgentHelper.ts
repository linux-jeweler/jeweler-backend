import { UAParser } from 'ua-parser-js';
import DistroController from '../controller/DistroController';

const distroController = new DistroController();

export const validateUserAgent = async (req: any) => {
  const userAgent = req;

  if (!userAgent) {
    return null;
  }

  const parser = new UAParser();
  const osName = parser.getOS();

  console.log('OS Name:', osName);

  if (osName === undefined) {
    return null;
  }

  // const distro = await distroController.getByName(osName);

  // if (distro) {
  //   return distro.name;
  // } else {
  //   return null;
  // }
};
