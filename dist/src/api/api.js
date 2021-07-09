const API_ENDPOINT =
  'https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev';

// https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
// ! 해당 API에서 errorData를 response.json()형태로 받고 그 안에 status와 statusText로 처리하는게 맞는 것 같은데...undefined가 나오는 것은 API의 문제인것인가?
function handleErrors(response) {
  let errorData;
  if (response.status === 404) {
    errorData = { message: 'Not Found', status: 404 };
    throw errorData;
  }
  if (response.status === 500) {
    errorData = { message: 'Internal Server error', status: 500 };
    throw errorData;
  }
}

const request = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      handleErrors(response);
    }
  } catch (e) {
    throw {
      message: e.message,
      status: e.status,
    };
  }
};

const api = {
  fetchCats: async (keyword) => {
    try {
      const cats = await request(
        `${API_ENDPOINT}/api/cats/search?q=${keyword}`
      );
      const result = cats.data;

      return {
        isError: false,
        data: result,
      };
    } catch (e) {
      return {
        isError: true,
        data: e,
      };
    }
  },
  //! fetchCats에서 통합해서 처리 시 자꾸 500에러발생
  fetchCatInfo: async (id) => {
    try {
      const catInfo = await request(`${API_ENDPOINT}/api/cats/${id}`);

      const result = catInfo.data;

      return {
        isError: false,
        data: result,
      };
    } catch (e) {
      return {
        isError: true,
        data: e,
      };
    }
  },
  fetchCatsRandom: async () => {
    try {
      const catsRandom = await request(`${API_ENDPOINT}/api/cats/random50`);

      const result = catsRandom.data;

      return {
        isError: false,
        data: result,
      };
    } catch (e) {
      return {
        isError: true,
        data: e,
      };
    }
  },
};
