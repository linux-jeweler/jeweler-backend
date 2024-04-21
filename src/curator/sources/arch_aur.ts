import express from 'express';
import axios from 'axios';
import '../../data-source';
import cors from 'cors';

export async function getAurInfo(name: string) {
  //takes package name as input and returns package info from AUR
  try {
    const response = await axios.get(process.env.ARCH_AUR + '/info/' + name);
    if (response.data?.resultcount == 1) {
      return response.data?.results[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function performAurSearch(query: string) {
  //takes search query as input and returns list of packages from AUR
}
