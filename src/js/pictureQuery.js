import axios from "axios";
import Notiflix from "notiflix";
import {onEndOfGalerey} from './alerts.js';
export {picturueQuery};
const BASE_URL = axios.defaults.baseURL = 'https://pixabay.com/api/';

async function picturueQuery(query,page,perPage) {
  try {
    const response = await axios.get(`${BASE_URL}/`,{
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        q: query,
        page: page,
        per_page: perPage,
        key: '29495659-8f5845388f8e68d2893953910'
      }
    });
    return response;
  } catch (error) {
    if(error.response.status === 400){
      onEndOfGalerey();
      return;
    };
  };
};