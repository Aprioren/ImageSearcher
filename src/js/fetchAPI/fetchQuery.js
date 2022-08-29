import axios from "axios";
export {picturueQuery};
axios.defaults.baseURL = 'https://pixabay.com/api/'
const KEY = 'key=29495659-8f5845388f8e68d2893953910';


async function picturueQuery(query,page) {
  try {
    const response = await axios.get(`/?${KEY}&q=${query}&${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`);
    return response;
  } catch (error) {
    console.error(error);
  }
}