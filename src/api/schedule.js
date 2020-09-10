import axios from "axios"
import {BACKEND} from "../cfg";
function fetchServices() {
  return new Promise((resolve, reject) => {
    axios.get(BACKEND+"/service")
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

export default {
  fetchServices
}