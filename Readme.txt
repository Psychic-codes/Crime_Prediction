# Crime Prediction Project - LA Dataset

## Project Info
This project is a full-stack Crime Prediction and FIR (First Information Report) management system based on the Los Angeles Crime Dataset. 
It helps users predict the probability of crime occurrence based on various parameters and also allows users to file FIRs through an integrated frontend and backend system.

- **Frontend:** React.js
- **Backend:** Node.js + Express + MongoDB
- **Crime Prediction:** Python (Flask API) using machine learning models

Key Features:
- Register and log FIRs.
- Predict crime probability in a given area.
- Visualize crime patterns.
- Seamless API integration between systems.

---

## Project Structure
- **fir-frontend/** : React.js Frontend for FIR System
- **fir-backend/** : Node.js Backend for FIR System
- **crm_pred/** : Python-based Crime Prediction System

---

## Setup Instructions

### 1. Clone the Repository
```bash
https://github.com/Crime_Prediction.git
cd Crime_Prediction
```

### 2. Setup fir-backend
```bash
cd fir-backend
npm install
```
- Create a `.env` file inside `fir-backend` directory.
- Add your MongoDB connection URL in `.env` like this:
  ```
  MONGO_URI=your_mongodb_connection_url
  ```
- Start the backend server:
```bash
node server.js
```

### 3. Setup fir-frontend
```bash
cd fir-frontend
npm install
npm run dev
```

### 4. Setup crm_pred (Python Crime Prediction)

#### Install Python Libraries
Make sure you have Python installed. Install the required libraries:
```bash
pip install flask flask-cors scikit-learn numpy pandas geopandas seaborn matplotlib xgboost
```

#### Dataset Setup
- Download the dataset from Kaggle: [Crime Dataset Link](https://www.kaggle.com/datasets/ishajangir/crime-data)
- Place the downloaded dataset inside the `crm_pred` folder.

#### Running the Python Code
- Open and run `crm.ipynb` first to create all the necessary `.pkl` (pickle) files.
- After running `crm.ipynb`, start the Flask server by running:
```bash
python app.py
```

This will initialize the API connection to your React frontend.

---

## Summary
| Part          | Commands                                   | Notes                                      |
|---------------|--------------------------------------------|--------------------------------------------|
| Backend       | `npm install`, `node server.js`            | Add MongoDB URL in `.env`                  |
| Frontend      | `npm install`, `npm run dev`               | Run after entering `fir-frontend`          |
| Crime Pred    | `pip install ...`, `python app.py`         | Run `crm.ipynb` before `app.py`            |

---

## Important
- Ensure all servers (frontend, backend, and python API) are running simultaneously.
- Make sure your dataset is placed correctly inside `crm_pred`.
- MongoDB connection is mandatory for backend to work.

---

## Contact
For any queries, open an issue on GitHub!

