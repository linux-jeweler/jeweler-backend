import dayjs from 'dayjs';

// Takes in raw data from the AUR, removes unnecessary data and formats the data to match the database schema

export function convertFromAurToDatabaseFormat(rawData: any) {
  const lastModifiedUnix = rawData.LastModified;
  const lastModified = dayjs(lastModifiedUnix).format();

  const formattedData = {
    name: rawData.Name,
    version: rawData.Version,
    dependencies: rawData.Depends,
    description: rawData.Description,
    lastModified: lastModified,
    license: rawData.License,
    url: rawData.URL,

    // instructions:
    //   'Copy the command below and paste it into your terminal to install' +
    //   rawData.Name,
    // installCommand: 'yay -S ' + rawData.Name,
    // downloadUrl: 'https://aur.archlinux.org/packages/' + rawData.Name,
  };

  return formattedData;
}
