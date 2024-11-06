import axios from "../utils/axios";

export default class ProductService {

    static baseURL = 'product';
    static variantUrl = 'product-varient';

    static list(data) {
        return axios.get(this.baseURL + '/list', { params: data });
    }
    static save(data, query) {
        return axios.post(this.baseURL + "/save", data, { params: query });
    }
    // static delete(id) {
    //     return axios.post(this.baseURL + '/delete', { ids: id });
    // }

    static vatiantList(data) {
        return axios.get(this.variantUrl + '/list', { params: data });
    }

    static vatiantSave(data) {
        return axios.post(this.variantUrl + '/save', data );
    }

    
    // static branddelete(id) {
    //     return axios.post(this.brandUrl + '/delete', { ids: id });
    // }

    // static brandsave(data, query) {
    //     return axios.post(this.brandUrl + "/save", data, { params: query });
    // }


}