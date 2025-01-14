import {useState} from "react"
import {useNavigate} from "react-router-dom"
import ProductCard from "../components/ProductCard"

const OrderStatus = (props) => {
    return (
        <div className={`order-status order-status-${props.status}`}>
            <p>{props.status}</p>
        </div>
    )
}

const UserHome = () => {
    const navigate = useNavigate()

    function viewAllProducts() {
        navigate("/products")
    }
    return (
        <div className="user-home-container">
            <h1>Welcome back, User</h1>
            <div id="row1">
                <div className="card">
                <h3>Voucher balance</h3>
                <h1>20 credits</h1>
                </div>
                <div className="card">
                    <div className="user-transaction-header">   
                        <h3>Recent Transactions</h3>
                        <a href="/transaction">{"View All >"}</a>
                    </div>
                    <div className="transaction-list">
                        <div className="transaction-item">
                            <b>Product</b>
                            <b>Price</b>
                            <b>Status</b>
                        </div>
                        <div className="transaction-item">
                            <p>item 1</p>
                            <p>14 credits</p>
                            <div style={{display: "flex"}}>
                                <OrderStatus status="approved"/>
                            </div>
                        </div>
                        <div className="transaction-item">
                            <p>item 1</p>
                            <p>14 credits</p>
                            <div style={{display: "flex"}}>
                                <OrderStatus status="pending"/>
                            </div>
                        </div>
                        <div className="transaction-item">
                            <p>item 1</p>
                            <p>14 credits</p>
                            <div style={{display: "flex"}}>
                                <OrderStatus status="rejected"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rec-product-header">
                <h2>New Products</h2>
                <button onClick={viewAllProducts}>View All</button>
            </div>
            <div className="rec-product-list">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
        </div>
        
        
    )
}

export default UserHome;

