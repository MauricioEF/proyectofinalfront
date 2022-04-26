import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import MainContainer from "../../components/layout/MainContainer";
import { useNavigate } from "react-router-dom";
import { productsService, cartService } from "../../services";
import './productDescription.scss'
const ProductDescription = (props) => {
    let params = useParams();
    let [product, setProduct] = useState(null);
    let [quantity, setQuantity] = useState(1);
    let [currentCart, setCurrentCart] = useState(null);
    let [updating, setUpdating] = useState(false);
    let [input,setInput] = useState({
        title:'',
        description:'',
        price:0,
        stock:0,
        code:0
    })
    let currentUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    console.log(currentUser);
    useEffect(() => {
        let pid = params.pid;
        productsService.getProductById({ pid: pid, callbackSuccess: callbackSuccessGetProductById, callbackError: callbackErrorGetProductById });
    }, [])
    useEffect(()=>{
        if(currentUser&&currentUser.role!=="superadmin"&&!currentCart){
            console.log(currentUser);
            cartService.getCartById({ cid: currentUser.cart, callbackSuccess: callbackSuccessGetCartById, callbackError: callbackErrorGetCartById });
        }
    },[currentUser])
    useEffect(()=>{
        if(product){
            setInput({
                ...product
            })
        }
    },[product])
    const addProduct = () => {
        if (quantity <= 0) {
            Swal.fire({
                icon: "error",
                title: "Pedido vacío",
                text: "No se puede agregar una cantidad de 0 o menor en el carrito",
                timer: 2000
            })
            return;
        }
        let pid = params.pid;
        cartService.addProductToCart({ cid: currentUser.cart, pid: pid, body: { quantity }, callbackSuccess: callbackSuccessAddProductToCart, callbackError: callbackErrorAddProductToCart });
    }
    const changeFromThumbnail = (product) => {
        window.location.replace('/products/' + product._id)
    }
    const setUpdate = () => {
        setUpdating(true);
    }
    /*CALLBACKS */
    const callbackSuccessGetProductById = (result) => {
        console.log(result.data.payload);
        setProduct(result.data.payload);
    }
    const callbackErrorGetProductById = (error) => {
        console.log(error);
    }
    const callbackSuccessGetCartById = (result) => {
        console.log(result.data.payload);
        setCurrentCart(result.data.payload.products);
    }
    const callbackErrorGetCartById = (error) => {
        console.log(error);
    }
    const callbackSuccessAddProductToCart = (result) => {
        console.log(result.data);
        Swal.fire({
            icon: "success",
            title: "Operación exitosa",
            text: "El producto se ha agregado a su carrito"
        })
        window.location.replace('/');
    }
    const callbackErrorAddProductToCart = (error) => {
        console.log(error);
    }
    return (<MainContainer>
        <div className="customRow">
            <div className="customColumn1">
                <div className="imagePanel">
                    <img src={product && product.thumbnail}></img>
                </div>
            </div>
            <div className="customColumn2">
                <div className="descriptionPanel">
                    <p style={{ fontSize: "35px" }}>{product && product.title}</p>
                    <p style={{ fontSize: "20px" }}>{product && product.description}</p>
                    <p style={{ fontSize: "40px" }}>$ {product && product.price}<span style={{ fontSize: "15px", position: "relative", bottom: "20px" }}>00</span></p>
                </div>
            </div>
            {
                currentUser.role !== 'superadmin' ?
                    <>
                        <div className="customColumn3">
                            <div className="pricingPanel">
                                <p>$ {product && product.price}<span style={{ fontSize: "8px", position: "relative", bottom: "8px" }}>00</span></p>
                                <p style={{ fontSize: "15px" }}>La entrega de este producto corre por cuenta de CoderHouse en <span style={{ color: "blue" }}>3 días hábiles</span></p>
                                <p style={{ fontSize: "13px", textAlign: "left" }}>¿Necesitas este producto con entrega inmediata? <span className="spanPlan">Cambia tu plan a premium</span></p>
                                <br />
                                <p>{product ? product.status ? product.status === "available" ? <span style={{ color: "green" }}>Aún con disponibilidad</span> : <span style={{ color: "red" }}>Sin disponibilidad</span> : null : null}</p>
                                <label>Cantidad : </label>
                                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
                                <br />
                                <br />
                                {
                                    currentCart ? currentCart.some(prod => prod.product._id === product._id) ? <>
                                        <p>El producto ya está en el carrito</p>
                                        <button className="addToCartButton">Ver carrito</button>
                                    </> :
                                        <button className="addToCartButton" onClick={addProduct}>Agregar al carrito</button> : null
                                }
                            </div>
                        </div>
                        <div className="customColumn4">
                            <div className="cartPanel">
                                <p style={{ fontSize: "11px" }}>Productos en tu carrito hasta el momento:</p>
                                {
                                    currentCart ? currentCart.length === 0 ? <p style={{ fontSize: "11px" }}>No tienes productos en este carrito aún</p> :
                                        currentCart.slice(0, 3).map(product => <><img onClick={() => changeFromThumbnail(product.product)} src={product.product.thumbnail} className="thumbnail" /></>) : null
                                }
                                <button className="addToCartButton" style={{ fontSize: "10px", padding: "5px", width: "55%" }}>Ver carrito completo</button>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="adminColumn">
                            {
                                !updating ?
                                    <div>

                                        <div>
                                            <ul>
                                                <li>Código:{product ? product.code : "Indefinido"}</li>
                                                <li>Stock: {product ? product.stock : "Indefinido"}</li>
                                            </ul>
                                        </div>
                                        <div style={{ textAlign: "center", marginTop: "40px" }}>
                                            <button className="addToCartButton" onClick={setUpdate}>Actualizar</button>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <p style={{ fontSize: "25px", textAlign: "center" }}>Actualizar producto</p>
                                        <div style={{textAlign:"center"}}>
                                            <label>Nombre del producto: </label>
                                            <input value={input.title}></input>
                                            <label>Descripción del producto:</label>
                                            <textarea value={input.description}></textarea>
                                            <label>Precio</label>
                                            <input value={input.price}></input>
                                            <p>Código: {product.code}</p>
                                            <label>Stock: </label>
                                            <input value={product.stock}/>
                                        </div>
                                    </div>
                            }
                        </div>
                    </>
            }
        </div>

    </MainContainer>)
}

export default ProductDescription;