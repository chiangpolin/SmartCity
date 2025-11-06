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

---

## Backend

The backend is implemented in **Python** and includes traffic prediction, route planning, and parking recommendation.

### Get Routes

- File: `get_routes.py`
- Connects with **Google Maps Directions API**:
https://routes.googleapis.com/directions/v2:computeRoutes
- Fetches optimal routes and travel times for the frontend

### Parking Algorithm

- File: `parking_algorithm.ipynb`
- Determines whether the driver should park or continue driving
- Main logic implemented in Jupyter Notebook for easy experimentation

### Traffic Flow Prediction

- File: `traffic_flow_prediction.ipynb`
- Predicts traffic flow using **Linear Regression** and **Polynomial Features** from `sklearn`
- Supports preprocessing, feature engineering, and model training

### Traffic Flow Visualization

- File: `traffic_flow_visualization.ipynb`
- Visualizes traffic data using `matplotlib.pyplot`
- Helps frontend designers and planners understand traffic patterns

---

## Frontend

- Built with **React.js** using **Vite.js**
- Main app: `App.jsx`
- Components in `/components` folder
- Provides interactive UI for:
- Viewing traffic flow predictions
- Parking recommendations
- Route information
