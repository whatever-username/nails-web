import axios from "axios";
import {BACKEND} from "../cfg";
function getUsers() {
return new Promise((resolve, reject) => {
  axios.get(BACKEND+"/users")
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
  getUsers
}