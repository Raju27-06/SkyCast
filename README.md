# 🌤️ SkyCast – Your Weather Guide  

SkyCast is a modern and responsive **weather web app** built with React, TailwindCSS, and the Open-Meteo API.  
It allows users to search for any city and view **real-time weather details**, **hourly updates**, and a **7-day forecast** in a clean, user-friendly interface.  

---

## ✨ Features  
- 🔍 **City Search** – Get weather details by searching any location.  
- 🌡️ **Current Weather** – Shows temperature, humidity, wind speed, and condition.  
- ⏰ **Hourly Forecast** – Next 24 hours with dynamic weather icons.  
- 📅 **7-Day Forecast** – High/low temperatures and conditions for the week.  
- 🎨 **Dynamic Icons** – Weather codes mapped to meaningful icons (sunny, cloudy, rainy).  
- 📱 **Responsive UI** – Works seamlessly across desktop and mobile devices.  
- ⚡ **Error & Loading States** – Handles API errors gracefully with loading feedback.  

---

## 🛠️ Tech Stack  
- **Frontend**: [React](https://react.dev/), [TailwindCSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)  
- **API**: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api), [Open-Meteo Forecast API](https://open-meteo.com/en/docs)  
- **HTTP Client**: [Axios](https://axios-http.com/)  

---

## 🚀 How It Works  
1. User enters a city name in the search bar.  
2. The app fetches the city’s coordinates using the **Geocoding API**.  
3. Coordinates are used to fetch **real-time and forecast data** from the **Forecast API**.  
4. Data is processed, mapped to conditions (sunny, cloudy, rainy), and displayed with proper formatting and icons.  

---

## 📷 Preview  
![image alt](https://github.com/Raju27-06/SkyCast/blob/8596e6bbb1b0af8cce6f5ece87ece96b3258c74d/Screenshot%20from%202025-09-13%2011-40-59.png)

---

## 🏃‍♂️ Getting Started  

Follow these steps to run the project locally:  

```bash
# Clone the repository
git clone https://github.com/your-username/skycast.git

# Navigate into the project folder
cd skycast

# Install dependencies
npm install

# Start the development server
npm start
