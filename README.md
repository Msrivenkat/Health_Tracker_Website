# Health_Tracker_App
# Health Tracker - Complete Folder Structure

## 📁 Project Structure

```
health-tracker/
├── backend/
│   ├── server.js                 # Express server with login API
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx         # Login component
│   │   │   ├── WaterTracker.jsx  # Water intake tracker
│   │   │   ├── FoodTracker.jsx   # Food & calorie tracker
│   │   │   ├── StepsTracker.jsx  # Steps tracker
│   │   │   └── WeightTracker.jsx # Weight & BMI tracker
│   │   ├── utils/
│   │   │   └── foodCalories.js   # Predefined food calorie list
│   │   ├── App.jsx               # Main app component
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── node_modules/
│
└── README.md
```

## 🚀 Setup Instructions

### Backend Setup

1. **Create backend folder and install dependencies:**
```bash
mkdir backend
cd backend
npm init -y
npm install express cors
```

2. **Create `server.js`** (code provided in separate artifact)

3. **Run the backend:**
```bash
node server.js
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. **Create React app:**
```bash
npx create-react-app frontend
cd frontend
```

2. **Install dependencies:**
```bash
npm install recharts
```

3. **Replace `src/App.js`** with the provided React code

4. **Run the frontend:**
```bash
npm start
```
App runs on `http://localhost:3000`

## 📊 Features Implemented

### 1. **User Name Display**
- Backend returns user's name after login
- Dashboard shows: "Hello, {name} 👋"

### 2. **Water Tracker**
- Add water intake in ml
- Tracks today's total
- Saves to localStorage
- LINE CHART showing daily water consumption

### 3. **Food & Calorie Tracker**
- Add multiple food items (name + grams)
- Predefined calorie list (per 100g)
- Auto-calculates: `(grams / 100) * caloriesPer100g`
- Edit/Delete functionality
- Displays total calories
- Saves to localStorage

### 4. **Steps Tracker**
- Manually add steps
- Shows today's total
- Saves to localStorage
- LINE CHART for daily steps

### 5. **Weight Tracker + BMI**
- Enter weight (kg) and height (m)
- Saves weight history to localStorage
- LINE CHART for weight progress
- Calculates BMI: `weight / (height²)`
- Displays BMI category (Underweight, Normal, Overweight, Obese)

## 💾 LocalStorage Keys

```javascript
'waterData'    // Array: [{ date, total }]
'stepsData'    // Array: [{ date, total }]
'foodItems'    // Array: [{ food, grams, calories }]
'weightData'   // Array: [{ date, weight }]
'userHeight'   // String: user's height in meters
```

## 🔐 Demo Login Credentials

**User 1:**
- Email: john@example.com
- Password: password123
- Name: John Doe

**User 2:**
- Email: jane@example.com
- Password: password123
- Name: Jane Smith

## 🍎 Predefined Food Calorie List (per 100g)

| Food | Calories |
|------|----------|
| Rice | 130 |
| Chicken Breast | 165 |
| Eggs | 155 |
| Bread | 265 |
| Banana | 89 |
| Apple | 52 |
| Milk | 42 |
| Pasta | 131 |
| Potato | 77 |
| Salmon | 208 |
| Broccoli | 34 |
| Cheese | 402 |
| Yogurt | 59 |
| Oats | 389 |
| Almonds | 579 |

## 🎨 UI Features

- Clean, modern dashboard layout
- Responsive grid design (2 columns on desktop)
- Color-coded sections:
  - 💧 Water: Blue
  - 🍎 Food: Green
  - 👟 Steps: Purple
  - ⚖️ Weight: Orange
- Recharts line charts for all tracking features
- Edit/Delete functionality for food items

## 📝 Notes

- No extra features added beyond the requirements
- All health data stored in localStorage (no backend needed for tracking)
- Backend only used for login and returning user's name
- Charts show last 7 days of data
- BMI formula: `weight(kg) / height(m)²`