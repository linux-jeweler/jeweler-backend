import dayjs from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

// Takes in raw data from the AUR, removes unnecessary data and formats the data to match the database schema

export interface AurPackageInfo {
  ID: number;
  Name: string;
  PackageBaseID: number;
  PackageBase: string;
  Version: string;
  Description: string;
  URL: string;
  NumVotes: number;
  Popularity: number;
  OutOfDate: number | null;
  Maintainer: string;
  Submitter: string;
  FirstSubmitted: number;
  LastModified: number;
  URLPath: string;
  Depends: string[];
  MakeDepends: string[];
  License: string[];
  Keywords: string[];
}

export interface SoftwareSourceData {
  softwareData: SoftwareData;
  softwareSourceData: SourceData;
}

export interface SoftwareData {
  name: string;
  version: string;
  dependencies: string[];
  description: string | null;
  lastModified: Date;
  license: string[];
  url: string | null;
}

export interface SourceData {
  source: string;
  instructions: string;
  installCommand: string;
  downloadLink: string;
}

export const hasBeenModified = (
  aurEntry: AurPackageInfo,
  databaseEntry: SoftwareData
) => {
  return !(aurEntry.LastModified === dayjs(databaseEntry.lastModified).unix());
};

export function convertFromAurToDatabaseFormat(
  rawData: any
): SoftwareSourceData {
  const rawDate = rawData.LastModified;
  var lastModified = 0 as any;
  if (dayjs(rawDate, 'YYYY-MM-DDTHH:MM:SS.sssZ', true).isValid()) {
    lastModified = rawDate;
  } else {
    lastModified = dayjs(rawDate * 1000).toDate();
  }

  const formattedSoftwareData: SoftwareData = {
    name: rawData.Name || rawData.name,
    version: rawData.Version || rawData.version,
    dependencies:
      rawData.Depends || rawData.depends || rawData.dependencies || [],
    description: rawData.Description || rawData.description || null,
    lastModified: lastModified || rawData.lastModified || new Date(),
    license: rawData.License || rawData.license || [],
    url: rawData.URL || rawData.url || null,
  };

  const formattedSoftwareSourceData: SourceData = {
    source: 'aur',
    instructions:
      'Copy the command below and paste it into your terminal to install' +
      rawData.Name,
    installCommand: 'yay -S ' + rawData.Name,
    downloadLink: 'https://aur.archlinux.org/packages/' + rawData.Name,
  };

  return {
    softwareData: formattedSoftwareData,
    softwareSourceData: formattedSoftwareSourceData,
  };
}
