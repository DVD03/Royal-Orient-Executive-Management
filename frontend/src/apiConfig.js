const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : (process.env.REACT_APP_API_URL || "https://gasmachineserestaurantapp-7aq4.onrender.com");

export default API_BASE_URL;
