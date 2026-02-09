const getErrorByStatus = (status) => {
  let message = '';
  switch (status) {
    case 401:
      message = 'Authorization failed. Please check your API token.';
      break;
    case 403:
      message = "Access denied. You don't have permission.";
      break;
    case 404:
      message = 'Resource not found.';
      break;
    case 429:
      message = 'Too many requests. Please wait and try again.';
      break;
    case status >= 500:
      message = 'Server error. Please try again later.';
    default: 
      message = 'Request failed. Please try again.';
      break;
  }

  return message;
};

export const createAirtableClient = ({ url, token }) => {
  const request = async ( method = 'GET', extraHeaders = {}, extraOptions = {}) => {
    const headers = {
      Authorization: token,
      ...extraHeaders,
    };
    const options = {
      method: method,
      headers: headers,
      ...extraOptions,
    };
    let response;
    try {
      response = await fetch(url, options);
    } catch (e) {
      throw new Error(
        'Network error. Check your internet connection and try again.'
      );
    }
    if (!response.ok) {
      throw new Error(getErrorByStatus(response.status));
    }
    const data = await response.json();
    return Array.isArray(data?.records) ? data.records : [];
  };
  return { request };
};
