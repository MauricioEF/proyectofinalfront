import io from 'socket.io-client'
import { useEffect, useState } from 'react';
import MainContainer from '../../components/layout/MainContainer';
import './chat.scss'
const Chat = () => {
    let socket;
    let [usersConnected, setUsersConnected] = useState([])
    let [message, setMessage] = useState('')
    const currentUser = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        socket = io(process.env.REACT_APP_BASE_URL, {
            query: `name=${currentUser.first_name} ${currentUser.last_name}&id=${currentUser.id}&thumbnail=${currentUser.profile_picture}`
        })
        socket.on('users', (data) => {
            setUsersConnected(data);
        })
        return () => {
            socket.close();
        }
    }, [])
    return <MainContainer socket={socket}>
        <div className="chatHeader">

        </div>
        <div style={{ minHeight: "500px", display: "flex" }}>
            <div className="col1" style={{ outline: "2px solid burlywood" }}>
                <div style={{ backgroundColor: "burlywood", padding: "20px 0" }}>
                    <p style={{ textAlign: "center", margin: "0" }}>Usuarios en esta sala</p>
                </div>
                <div style={{ height: "87%" }}>
                    {
                        usersConnected ? Object.keys(usersConnected).slice(0, 10).map(key => {
                            return <div className="userCard">
                                <div style={{ paddingTop: "10px", marginRight: "10px" }}>
                                    <img className="thumbnail" src={usersConnected[key].thumbnail} />
                                </div>
                                <div style={{ display: "inline-block" }}>
                                    <p>{usersConnected[key].name}</p>
                                </div>
                            </div>
                        }) : null
                    }
                </div>
            </div>
            <div className="col2">
                <div style={{ padding: "0 5px 0 10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ overflowY: "auto" }}>
                        <p>Aquí van a ir los mensajes</p>
                    </div>
                    <div style={{ paddingBottom: "25px" }}>
                        <div style={{ float: "left", width: "90%" }}>
                            <textarea style={{width:"95%",resize:"none"}}></textarea>
                        </div>
                        <div style={{ float: "left", width: "10%" }}>
                            <button className="chatButton">ENVIAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MainContainer>
}

export default Chat;