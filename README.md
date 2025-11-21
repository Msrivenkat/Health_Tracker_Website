Features Overview
🔐 1. User Authentication

Sign Up:
Users enter their name, email, and password to create an account.
All user data is securely stored in the MySQL database.

Login:
Users log in using their registered email and password.
Validation is done using backend API calls.

After login, the user is redirected to the Dashboard.

🏠 2. Pages in the App

Homepage
Includes a Get Started button, which takes the user to the signup page.

About Us Page
Explain why we need to use the Health Tracker website

Signup Page
For new user registration.

Login Page
For returning users to authenticate.

📊 3. Dashboard Features

Once the user logs in, they can access all health tools from the dashboard:

⚖️ Body Mass Index (BMI)

User enters height and weight.

App calculates and displays the BMI result.

😴 Sleep Indicator (Line Chart)

User logs their daily sleep hours.

Data is visualized using a line chart to show sleep patterns.

💧 Water Intake Tracker (Line Chart)

User adds the amount of water they drink.

A line graph displays daily hydration progress.

🍽️ Calorie Tracking

Contains a custom food database object.

User enters how many grams of a food item they ate.

The app calculates calories based on 100g values.

Total calorie intake is shown for each entry.

🛠️ Tech Stack
Frontend

React.js

Recharts (for line graphs)

Lucide-react icons

Custom CSS

Backend

Node.js (Express)

CORS

MySQL database (for authentication + user data)
