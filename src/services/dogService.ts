import axios from 'axios';
import axiosRetry from 'axios-retry';
import { DogResponse } from '../types/dog';

const client = axios.create({
  baseURL: 'http://localhost:3001/api',
});

axiosRetry(client, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay
});

export const fetchDogs = async (page: number): Promise<DogResponse> => {
  try {
    console.log("Fetching page ", page);
    const response = await client.get(`/dogs?page=${page}`);

    if (response.data.error) {
        console.log(`Error in response for page ${page} with error ${response.status}`);
        throw new Error("Invalid data received from dogs API");
    }
    
    return { data: response.data };
  } catch (err) {
    throw err;
  }
};
