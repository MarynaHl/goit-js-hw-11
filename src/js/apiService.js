const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25354007-4da20173cd76d61434be87abf';

export default class ApiService {
  constructor() {
    this.totalHits = 0;

    this.options = {
      params: {
        key: KEY,
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    };
  }

  async fetchData() {
    const response = await axios.get(BASE_URL, this.options);
    const { hits, total, totalHits } = await response.data;

    this.totalHits = total;

    if (response.status == 200) {
      this.incrementPage();
    }

    return response.data;
  }

  incrementPage() {
    this.options.params.page += 1;
  }

  resetPage() {
    this.options.params.page = 1;
  }

  get page() {
    return this.options.params.page;
  }

  get hits() {
    return this.totalHits;
  }

  get query() {
    return this.options.params.q;
  }

  set query(newQuery) {
    this.options.params.q = newQuery;
  }
}