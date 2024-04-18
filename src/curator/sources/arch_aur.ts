import express from 'express';
import axios from 'axios';
import './data-source';
import cors from 'cors';

export async function getAurInfo(name: string) {
  //takes package name as input and returns package info from AUR
  try {
    const response = await axios.get(process.env.ARCH_AUR + '/info/' + name);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function performAurSearch(query: string) {
  //takes search query as input and returns list of packages from AUR
}
