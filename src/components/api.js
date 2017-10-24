const API_HOST = "http://localhost:8000";

export const api_get = (endpoint, success, failure) => {
  fetch( API_HOST + endpoint)
    .then( resp => resp.json() )
    .then( data => success )
    .catch( err => failure )
};
