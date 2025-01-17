import React from "react";
import { useNavigate } from "react-router-dom";
import pizza from "./images/pizza.jpg";

function Home() {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleImageClick = () => {
        navigate("/order");
    };

    return (
        <div>
            <h2>Welcome to Bloom Pizza!</h2>
            <img
                alt="order-pizza"
                style={{ cursor: "pointer" }}
                src={pizza}
                onClick={handleImageClick} // Attach click handler
            />
        </div>
    );
}

export default Home;
