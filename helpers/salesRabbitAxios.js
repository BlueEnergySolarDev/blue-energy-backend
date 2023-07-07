const axios = require("axios");

const getSalesRabbit = (url) => {
  const baseURL = process.env.API_SALESRABBIT;

  const reqInstance = axios.create({
    headers: {
      Authorization: `Bearer ${process.env.API_SALESRABBIT_TOKEN}`
    }
  });

  return reqInstance.get(baseURL + url)
    .then(response => response.data.data);
};
module.exports = {
  getSalesRabbit,
};
