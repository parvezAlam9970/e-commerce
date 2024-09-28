import axios from "../utils/axios";

export default class service {

    static baseURL = '';

    /**
     * Contactus Services
     **/

    static detailContactus(data) {
        return axios.get(this.baseURL + "/contact-us/details/" + data.type);
    }
    static listContactus(data) {
        return axios.get(this.baseURL + "/contact-us/list", { params: data });
    }
    static saveContactus(data, query) {
        return axios.post(this.baseURL + "/contact-us/save", data, { params: query });
    }

    /**
     * Application Services
     **/

    static detailApplication(data) {
        return axios.get(this.baseURL + "/application/details/" + data.type);
    }
    static listApplication(data) {
        return axios.get(this.baseURL + "/application/list", { params: data });
    }
    static saveApplication(data, query) {
        return axios.post(this.baseURL + "/application/save", data, { params: query });
    }
}