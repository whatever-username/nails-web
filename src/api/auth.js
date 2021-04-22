import axios from "axios";
import {BACKEND} from "../cfg";

function getSmsCode(phone) {
  return new Promise((resolve, reject) => {
    let query = {phone: phone};
    console.log(query)
    axios.get(BACKEND + "/getCode", {params: query})
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function getToken(phone, code) {
  return new Promise((resolve, reject) => {
    let data = {
      phone: phone,
      smsCode: code
    };
    axios.post(BACKEND + "/getToken", data)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function auth(token) {
  return new Promise((resolve, reject) => {
    let data = {
      token: token,
    };
    axios.post(BACKEND + "/auth", data)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function logout(id) {
  return new Promise((resolve, reject) => {
    let data = {
      id: id,
    };
    axios.post(BACKEND + "/dologout", data)
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
  getSmsCode,
  getToken,
  auth,
  logout
}
