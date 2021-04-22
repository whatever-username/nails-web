import axios from "axios"
import {BACKEND} from "../cfg";

function fetchSchedule(fromDate, toDate) {
  return new Promise((resolve, reject) => {
    let query = {from: fromDate, to: toDate};
    axios.get(BACKEND + "/schedule", {params: query})
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function fetchUserSchedule(fromDate, toDate) {
  return new Promise((resolve, reject) => {
    let query = {from: fromDate, to: toDate};
    axios.get(BACKEND + "/userSchedule", {params: query})
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function fetchMasterSchedule(fromDate, toDate) {
  return new Promise((resolve, reject) => {
    let query = {from: fromDate, to: toDate};
    axios.get(BACKEND + "/masterSchedule", {params: query})
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function addMaster(rec) {
  return new Promise((resolve, reject) => {
    axios.post(BACKEND + "/addMaster", rec)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function declineRec(payload) {
  return new Promise((resolve, reject) => {
    axios.post(BACKEND + "/declineRec", payload)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function assignCustomerAndService(rec) {
  return new Promise((resolve, reject) => {
    axios.post(BACKEND + "/assignCustomerAndService", rec)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}

function assignUser(payload) {
  console.log(payload)
  return new Promise((resolve, reject) => {
    axios.post(BACKEND + "/assignUser", payload)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}
function addMasterToCell(payload) {
  console.log(payload)
  return new Promise((resolve, reject) => {
    axios.post(BACKEND + "/addMasterToCell", payload)
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(`API Error: ${error}`);
        reject(error);
      });

  });
}
function declineRecByDateTime(payload) {
  return new Promise((resolve, reject) => {
    axios.post(BACKEND + "/declineRecByDateTime", payload)
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
  declineRecByDateTime,
  addMasterToCell,
  assignCustomerAndService,
  fetchSchedule,
  addMaster,
  declineRec,
  fetchUserSchedule,
  assignUser,
  fetchMasterSchedule
}