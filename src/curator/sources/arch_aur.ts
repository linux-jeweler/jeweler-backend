import axios from 'axios';
import '../../data-source';
import e from 'express';

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

export async function syncDatabaseWithAur() {

