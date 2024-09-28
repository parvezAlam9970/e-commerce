import axios from "../utils/axios";

export default class serviceRight {

    static baseURL = '';

    static list(data) {
        return axios.get(this.baseURL + '/list-user', { params: data });
    }
    static save(data, query) {
        return axios.post(this.baseURL + "/save-user", data, { params: query });
    }
    static delete(id) {
        return axios.post(this.baseURL + '/delete-user', { ids: id });
    }
}