const getErrorByStatus = (status) => {
  if (status === 401)
    return 'Authorization failed. Please check your API token.';
  if (status === 403) return "Access denied. You don't have permission.";
  if (status === 404) return 'Resource not found.';
  if (status === 429) return 'Too many requests. Please wait and try again.';
  if (status >= 500) return 'Server error. Please try again later.';
  return 'Request failed. Please try again.';
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
