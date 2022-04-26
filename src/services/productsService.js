import {getAuthHeaders} from '../utils.js'

export default class ProductsService{
    httpClient
    constructor(client){
        this.httpClient=client;
    }

    getProducts = (callbackSuccess,callbackError) =>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_GET_ALL_PRODUCTS}`,config:getAuthHeaders(),callbackSuccess,callbackError}
        this.httpClient.makeGetRequest(data);
    }
    getProductById = ({pid,callbackSuccess,callbackError}) =>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_GET_PRODUCT_BY_ID}${pid}`,config:getAuthHeaders(),callbackSuccess,callbackError} 
        this.httpClient.makeGetRequest(data);   
    }
    createProduct=({body,callbackSuccess,callbackError})=> {
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CREATE_PRODUCT}`,body,config:getAuthHeaders(),callbackSuccess,callbackError}
        this.httpClient.makePostRequest(data);
    }
}