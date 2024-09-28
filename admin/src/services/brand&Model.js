import axios from "../utils/axios";

export default class brandAndModel {

    static baseURL = 'model';
    static brandUrl = 'brand';

    static list(data) {
        return axios.get(this.baseURL + '/list', { params: data });
    }
    static save(data, query) {
        return axios.post(this.baseURL + "/save", data, { params: query });
    }
    static delete(id) {
        return axios.post(this.baseURL + '/delete', { ids: id });
    }



    static brandList(data) {
        return axios.get(this.brandUrl + '/list', { params: data });
    }

    
    static branddelete(id) {
        return axios.post(this.brandUrl + '/delete', { ids: id });
    }

    static brandsave(data, query) {
        return axios.post(this.brandUrl + "/save", data, { params: query });
    }


}