import axios from "../utils/axios";

export default class service {

    static baseURL = 'category';

    /* Category */


    static list(data) {
        return axios.get(this.baseURL + "/list", { params: data });
    }
    static listWithChildren(data) {
        return axios.get(this.baseURL + "/list-all", { params: data });
    }
    static save(data, query) {
        return axios.post(this.baseURL + "/save", data, { params: query });
    }
    static delete(id) {
        return axios.post(this.baseURL + "/delete", { ids: id });
    }

    /* Sub Category */


    static listSubMaster(data) {
        return axios.get(this.baseURL + "/sub-master/list", { params: data });
    }
    static saveSubMaster(data, query) {
        return axios.post(this.baseURL + "/sub-master/save", data, { params: query });
    }
    static deleteSubMaster(id) {
        return axios.post(this.baseURL + "/sub-master/delete", { ids: id });
    }

    /* Sub Master Data */


    static listSubMasterData(data) {
        return axios.get(this.baseURL + "/sub-master/data/list", { params: data });
    }
    static saveSubMasterData(data, query) {
        return axios.post(this.baseURL + "/sub-master/data/save", data, { params: query });
    }
    static deleteSubMasterData(id) {
        return axios.post(this.baseURL + "/sub-master/data/delete", { ids: id });
    }

}
