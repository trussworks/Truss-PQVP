const actionHelpers = {
  checkStatus: (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  },
  parseJSON: response => response.json(),
  checkSuccess: (response) => {
    console.log(response, 'check success');
    if (response.success === false) {
      const error = new Error(response.message);
      error.response = response;
      throw error;
    }

    return response;
  },
  logError: (error) => {
    console.error('Request failed:', error);
  },
};

export default actionHelpers;
