// Environment configuration
export const config = {
  // Backend API URL - Use production for OAuth, local for development
  backendUrl: import.meta.env.VITE_BACKEND_URL || "https://project-final-pfy9.onrender.com",

  // Frontend URL
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || "http://127.0.0.1:5173",

  // App name
  appName: "Banganza",

};
