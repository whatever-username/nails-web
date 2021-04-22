import axios from "axios"
import {BACKEND} from "../cfg";
function fetchCustomers() {
  return new Promise((resolve, reject) => {
    axios.get(BACKEND+"/customers")
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
  fetchCustomers
}