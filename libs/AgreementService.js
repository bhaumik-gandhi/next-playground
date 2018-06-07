import axios from "axios";

const SERVER_URL = "http://localhost:1337/";

export default class AgreementService {

  static get = () => {
    console.log("GET SERVICE");
    return new Promise((resolve, reject) => {
      axios.get(SERVER_URL)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  static create = (data) => {
    console.log("Create SERVICE");
    return new Promise((resolve, reject) => {
      axios.post(SERVER_URL + 'create', data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  static delete = (ids) => {
    console.log("DELETE SERVICE");
    return new Promise((resolve, reject) => {
      axios.post(SERVER_URL + 'delete', ids)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  static filter = (data) => {
    console.log("Filter SERVICE");
    return new Promise((resolve, reject) => {
      axios.post(SERVER_URL + 'filter', data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }

}