import axios from "../utils/axios";

export default class service{

    static baseURL = '';

    static login(data){
        return axios.post( this.baseURL + "/login", data);
    }
    static validateToken(data){
        return axios.post("../validate-token", data);
    }
    static profile(data){
        return axios.get(this.baseURL + "/profile", {params: data});
    }
    static saveProfile(data){
        return axios.post(this.baseURL + "/save-profile", data);
    }
    static updatePassword(data){
        return axios.post(this.baseURL + "/update-password", data);
    }

    static list(data) {
        return axios.get(this.baseURL + '/list', { params: data });
    }
    static save(data) {
        return axios.post(this.baseURL + "/save", data);
    }
    static delete(id) {
        return axios.post(this.baseURL + '/delete', {ids: id});
    }
   
    /// users api 
    static listUser(data) {
        return axios.get(this.baseURL + '/list-user', { params: data });
    }
    static saveUser(data) {
        return axios.post(this.baseURL + "/save-user", data);
    }
    static deleteUser(id) {
        return axios.post(this.baseURL + '/delete-user', {ids: id});
    }
    static changeAvatar(data) {
        return axios.post(this.baseURL + '/change-avatar', data);
    }
}