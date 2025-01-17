import {useState, useEffect, useContext} from "react"
import axios from "axios"
import {AuthContext} from "../context/AuthContext"
import {formatDate} from "../util.js"
import useToast from "../hooks/useToast.js"
import {useNavigate} from "react-router-dom"

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState([])
    const [refresh, setRefresh] = useState(true);
    const {token, isAdmin} = useContext(AuthContext)

    const timeZoneParams = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    }

    const {toastError, toastSuccess} = useToast()
    const navigate = useNavigate()

    //const formattedDate = date.toLocaleDateString("en-US", );
      
    useEffect(()=> {
        
        const fetchData = async() => {
            if (!refresh) return;

            if (!token) {
                toastError("Log in as admin to access this page")
                navigate("/login")
                return
            }

            if (!isAdmin) {
                toastError("Log in as admin to access this page")
                navigate("/")
                return
            }
            
            try {
                setRefresh(false)
                const res = await axios.get("api/order/listOrder", {header: {token: token}})
                if (res.data.success) {
                    const data = res.data.data;
                    const newArray = []
                    console.log(data)
                    for (let item of data) {
                        newArray.push({
                            id: item._id,
                            user: item.userName,
                            item: item.itemName,
                            quantity: item.quantityRequested,
                            price: item.itemPrice,
                            date: formatDate(item.createdAt),
                            status: item.status
                        })
                    }
                    setRequests(newArray);

                    const summarizedOrders = newArray.reduce((summary, order) => {
                        if (order.status !== "delivered") {
                            const existingItem = summary.find(item => item.itemName === order.item);
                            if (existingItem) {
                                existingItem.quantity += order.quantity;
                            } else {
                                summary.push({ itemName: order.item, quantity: order.quantity });
                            }
                            
                        }
                        return summary;
                    }, []);
                    console.log(summarizedOrders)
                    setSummary(summarizedOrders)
                }
            } catch(err) {

            }
            
        }
        fetchData()
    }, [refresh])

    function markAsDelivered(id) {
        const postData = async() => {
            try {
                const res = await axios.post("api/order/deliverOrder", {orderID: id}, {headers: {token: token}})
                if (!res.data.success) {
                    toastError("Something went wrong")
                    console.log(res.data)
                    return;
                } else {
                    toastSuccess("Marked as delivered")
                    setRefresh(true)
                }
            } catch(err) {
                toastError("Something went wrong!");
                console.log(err)
            }
        }
        postData()
    }

    return (
        <div className="product-page-container">
            <div className="product-page-header">
                <h1>Requests</h1>
            </div>
            <div className="order-summary">
                <h2>Pending Order Summary</h2>
                {summary.length > 0 ? 
                    <div className="table-item header">
                        <p>Product</p>
                        <p>Quantity</p>
                    </div> : 
                    <h3>No orders to fulfill!</h3>}
                
                {summary.map((item) => {
                    return <div key={item.itemName} className="table-item">
                        <p>{item.itemName}</p>
                        <p>{item.quantity}</p>
                    </div>
                })}
            </div>
            
            <div className="requests-table">
                <h2 style={{margin: "0", marginBottom: "8px"}}>All Orders</h2>
                {requests.length > 0 ? 
                    <div className="transaction-item transaction-header">
                        <p>User</p>
                        <p>Item</p>
                        <p>Quantity</p>
                        <p>Price</p>
                        <p>Total Price</p>
                        <p>Order created</p>
                        <p>Action</p>
                    </div> : 
                    <h3>No orders in database</h3>}
                
                {requests.map((request) => {
                    return (
                        <div key={request.id} className="transaction-item">
                            <div><p>{request.user}</p></div>
                            <div><p>{request.item}</p></div>
                            <div><p>{request.quantity}</p></div>    
                            <div><p>{request.price} credits</p></div>    
                            <div><p>{request.price * request.quantity} credits</p></div>  
                            <div><p>{request.date}</p></div>    
                            <div style={{display: "flex"}}>
                                {request.status === "pending" ?
                                    <button onClick={()=>markAsDelivered(request.id)}>Mark As Delivered</button> :
                                    <button style={{backgroundColor: "grey"}}>Delivered</button>}
                                
                            </div>
                            
                        </div>
                    )
                })}
            </div>
            
        </div>
    )
}

export default Requests