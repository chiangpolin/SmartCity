# Smart City

Visit the [Website](https://city.chiangpolin.com/)
Download [PDF](https://city.chiangpolin.com/pdf/smart_city.pdf)

This project is a **Smart City traffic and parking management system** that integrates real-time traffic prediction, route planning, and parking recommendation.

The **backend**, built with Python, handles traffic flow prediction using machine learning, calculates optimal routes via the Google Maps API, and suggests feasible parking locations based on distance, availability, and cost.  

The **frontend**, built with React.js, provides an interactive interface to visualize traffic patterns, explore recommended routes, and view parking options, enabling smarter transportation decisions for city drivers.

```
├── backend/
│   ├── src/
│   │   ├── get_routes.py                # Connects with Google Maps API
│   │   ├── parking_algorithm.ipynb      # Algorithm to suggest parking or continue driving
│   │   ├── traffic_flow_prediction.ipynb # Predict traffic flow using sklearn LinearRegression & PolynomialFeatures
│   │   └── traffic_flow_visualization.ipynb # Visualize traffic flow with matplotlib
│
├── frontend/
│   ├── public/                           # Public assets
│   └── src/
│       ├── components/                   # React components
│       └── App.jsx                        # Main React app

```
---

## Backend

The backend is implemented in **Python** and includes traffic prediction, route planning, and parking recommendation.

### Get Routes

- File: `get_routes.py`
- Connects with **Google Maps Directions API**:
https://routes.googleapis.com/directions/v2:computeRoutes
- Fetches optimal routes and travel times for the frontend

![plot](/frontend/public/images/website_5.png)

### Parking Algorithm

- File: `parking_algorithm.ipynb`
- Determines whether the driver should park or continue driving
- Main logic implemented in Jupyter Notebook for easy experimentation

![plot](/frontend/public/images/website_4.png)

### Traffic Flow Prediction

- File: `traffic_flow_prediction.ipynb`
- Predicts traffic flow using **Linear Regression** and **Polynomial Features** from `sklearn`
- Supports preprocessing, feature engineering, and model training

![plot](/frontend/public/images/website_2.png)
![plot](/frontend/public/images/website_3.png)

### Traffic Flow Visualization

- File: `traffic_flow_visualization.ipynb`
- Visualizes traffic data using `matplotlib.pyplot`
- Helps frontend designers and planners understand traffic patterns

![plot](/frontend/public/images/website_1.png)

---

## Frontend

- Built with **React.js** using **Vite.js**
- Main app: `App.jsx`
- Components in `/components` folder provide interactive UI for:
    - Viewing traffic flow predictions
    - Parking recommendations
    - Route information
