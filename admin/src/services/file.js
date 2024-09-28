import axios from "../utils/axios";

export default class service {

    static baseURL = 'file';

    // Generic GET request
    static get(url) {
        return axios.get("../" + url);
    }

    // Method to save (upload) a file using multipart/form-data
    static save(formData) {
       

        // No need to set 'Content-Type': axios will automatically set it for FormData
        return axios.post(this.baseURL + "/save", formData);
    }

    // Method to remove a file
    static remove(data) {
        return axios.post(this.baseURL + "/remove", data);
    }
}
