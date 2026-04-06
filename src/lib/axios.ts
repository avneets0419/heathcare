import axios from "axios";

// Create Axios instance
export const api = axios.create({
    baseURL: "http://localhost:5000/api", // change if needed
    headers: {
        "Content-Type": "application/json",
    },
});