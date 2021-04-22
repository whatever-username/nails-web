import axios from "axios"
import {BACKEND} from "../cfg";
function fetchMasters() {
  return new Promise((resolve, reject) => {
    axios.get(BACKEND+"/masters")
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
  fetchMasters
}