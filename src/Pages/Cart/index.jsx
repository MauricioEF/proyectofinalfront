import { useEffect, useState } from "react";
import { cartService } from "../../services";
import MainContainer from "../../components/layout/MainContainer"
import './cart.scss';
import Swal from "sweetalert2";
const Cart = props => {
    let [cart, setCart] = useState(null);
    let [input, setInput] = useState({});
    let [dirty, setDirty] = useState(false);

    let currentUser = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        cartService.getCartById({ cid: currentUser.cart, callbackSuccess: callbackSuccessGetCart, callbackError: callbackErrorGetCart })
    }, [])

    useEffect(() => {
        if (cart) {
            let input = {}
            for (let element of cart.products) {
                input[element.product.title] = element.quantity
            }
            setInput(input);
        }
    }, [cart])
    useEffect(() => {
        console.log(input);
    }, [input])

    const handleInputChange = (title, quantity) => {
        setDirty(true)
        if (quantity <= 0) {
            setInput(prev => ({ ...prev, [title]: 0 }))
            Swal.fire({
                title:"Eliminar producto del carrito",
                text:"¿Deseas eliminar este producto del carrito?",
                showConfirmButton:true,
                confirmButtonText:"¡Aún quiero este producto!",
                confirmButtonColor:"green",
                showCancelButton:true,
                cancelButtonText:"Eliminar producto",
                cancelButtonColor:"red"
            }).then(result=>{
                if(result.isConfirmed){
                    setInput(prev => ({ ...prev, [title]: 1 }))
                }
                else{
                    let pid = cart.products.find(element=>element.product.title===title).product._id;
                    cartService.deleteProductFromCart({cid:cart._id,pid,callbackSuccess:callbackSuccessDeleteProductFromCart,callbackError:callbackErrorDeleteProductFromCart})
                }
            })
            return;
        }
        setInput(prev => ({ ...prev, [title]: quantity }))
    }
    //CALLBACKS
    const callbackSuccessGetCart = (response) => {
        console.log(response.data);
        setCart(response.data.payload)
    }
    const callbackErrorGetCart = (error) => {
        console.log(error);
    }
    const callbackSuccessDeleteProductFromCart = (response) =>{
        cartService.getCartById({ cid: currentUser.cart, callbackSuccess: callbackSuccessGetCart, callbackError: callbackErrorGetCart })
    }
    const callbackErrorDeleteProductFromCart = (error) =>{
        console.log(error);
    }
    return (
        <MainContainer>
            <div className="column1">
                {dirty && <p>Advertencia: Todo cambio está sujeto a disponibilidad, guardar los cambios para corroborar stock</p>}
                <div className="productsPanel">
                    {
                        cart ? cart.products.map(element => <div>
                            <div className="subColumn1">
                                <p>{element.product.title}</p>
                            </div>
                            <div className="subColumn2">
                                <p>{element.product.price}</p>
                            </div>
                            <div className="subColumn3">
                                <div style={{ display: "flex" }}>
                                    <button onClick={() => handleInputChange(element.product.title, --input[element.product.title])}> {"<"} </button>
                                    <p>{input[element.product.title]}</p>
                                    <button onClick={() => handleInputChange(element.product.title, ++input[element.product.title])}>{">"}</button>
                                </div>
                            </div>
                        </div>) :
                            <p>No hay productos en el carrito</p>
                    }
                </div>
            </div>
            <div className="column2">
                <div className="purchasePanel">
                    <p>Panel de compra</p>
                    <div>
                        Cuenta:
                        {
                            cart?cart.products.map(element=><div>
                                <span>{element.product.title} : {element.product.price} x {input[element.product.title]} = {element.product.price*input[element.product.title]}</span>
                            </div>):<p>Aún no tienes productos en tu cuenta</p>
                        }
                    </div>
                </div>
            </div>
        </MainContainer>
    )
}

export default Cart;