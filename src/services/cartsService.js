import {getAuthHeaders} from '../utils.js'

export default class CartsService{
    httpClient
    constructor(client){
        this.httpClient=client;
    }
    getCartById = ({cid,callbackSuccess,callbackError}) =>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_GET_CART}${cid}`,config:getAuthHeaders(),callbackSuccess,callbackError};
        this.httpClient.makeGetRequest(data);
    }
    addProductToCart = ({cid,pid,body,callbackSuccess,callbackError}) =>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ADD_PRODUCT_TO_CART}${cid}/products/${pid}`,body,config:getAuthHeaders(),callbackSuccess,callbackError};
        this.httpClient.makePostRequest(data);
    }
}