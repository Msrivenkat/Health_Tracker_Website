import React, { useState, useEffect } from "react";
import { Droplets, Moon, Heart, Plus, X, Edit2, Utensils } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./dashboard.css";

const foodDatabase = {
  rice: 130,
  chicken: 165,
  egg: 155,
  bread: 265,
  milk: 42,
  apple: 52,
  banana: 89,
  potato: 77,
  pasta: 131,
  cheese: 402,
  yogurt: 59,
  salmon: 208,
  beef: 250,
  broccoli: 34,
  carrot: 41,
  tomato: 18,
  spinach: 23,
  orange: 47,
  butter: 717,
  oil: 884,
  sugar: 387,
  flour: 364,
  oats: 389,
  almonds: 579,
  peanuts: 567,
  chocolate: 546,
  icecream: 207,
  idly: 128,
};

export default function HealthTracker() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [entries, setEntries] = useState({
    water: [],
    sleep: [],
    calories: [],
    bmi: [],
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});
  const [foodItems, setFoodItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedEntries = { water: [], sleep: [], calories: [], bmi: [] };

    ["water", "sleep", "calories", "bmi"].forEach((type) => {
      const data = JSON.parse(localStorage.getItem(`${type}Data`) || "[]");
      loadedEntries[type] = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    });

    setEntries(loadedEntries);
  };

  const saveEntry = (type, data) => {
    const timestamp = Date.now();
    const entry = { ...data, date: new Date().toISOString(), id: timestamp };

    const existingData = JSON.parse(
      localStorage.getItem(`${type}Data`) || "[]"
    );
    const newData = [entry, ...existingData];
    localStorage.setItem(`${type}Data`, JSON.stringify(newData));

    setEntries((prev) => ({
      ...prev,
      [type]: newData,
    }));
  };

  const deleteEntry = (type, id) => {
    const existingData = JSON.parse(
      localStorage.getItem(`${type}Data`) || "[]"
    );
    const newData = existingData.filter((e) => e.id !== id);
    localStorage.setItem(`${type}Data`, JSON.stringify(newData));

    setEntries((prev) => ({
      ...prev,
      [type]: newData,
    }));
  };

  const openAddModal = (type) => {
    setModalType(type);
    setFormData({});
    setFoodItems([]);
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    if (modalType === "calories") {
      const totalCalories = foodItems.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.caloriesPer100g) * parseFloat(item.grams)) / 100,
        0
      );
      saveEntry(modalType, {
        totalCalories: totalCalories.toFixed(0),
        items: foodItems,
      });
    } else if (modalType === "bmi") {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      saveEntry(modalType, {
        height: formData.height,
        weight: formData.weight,
        bmi: bmiValue,
      });
    } else {
      saveEntry(modalType, formData);
    }
    setShowAddModal(false);
    setFormData({});
    setFoodItems([]);
  };

  const addFoodItem = () => {
    if (formData.foodName && formData.grams) {
      const calories = formData.caloriesPer100g || 0;
      if (editingItem !== null) {
        const updated = [...foodItems];
        updated[editingItem] = {
          foodName: formData.foodName,
          grams: formData.grams,
          caloriesPer100g: calories,
        };
        setFoodItems(updated);
        setEditingItem(null);
      } else {
        setFoodItems([
          ...foodItems,
          {
            foodName: formData.foodName,
            grams: formData.grams,
            caloriesPer100g: calories,
          },
        ]);
      }
      setFormData({ foodName: "", grams: "", caloriesPer100g: "" });
      setSearchQuery("");
      setFilteredFoods([]);
    }
  };

  const selectFood = (foodName) => {
    const calories = foodDatabase[foodName.toLowerCase()] || 0;
    setFormData({
      ...formData,
      foodName: foodName.charAt(0).toUpperCase() + foodName.slice(1),
      caloriesPer100g: calories,
    });
    setSearchQuery(foodName.charAt(0).toUpperCase() + foodName.slice(1));
    setFilteredFoods([]);
  };

  const handleFoodSearch = (value) => {
    setSearchQuery(value);
    setFormData({ ...formData, foodName: value });

    if (value.length > 0) {
      const matches = Object.keys(foodDatabase)
        .filter((food) => food.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFilteredFoods(matches);

      const exactMatch = foodDatabase[value.toLowerCase()];
      if (exactMatch) {
        setFormData({
          ...formData,
          foodName: value,
          caloriesPer100g: exactMatch,
        });
      }
    } else {
      setFilteredFoods([]);
    }
  };

  const editFoodItem = (index) => {
    const item = foodItems[index];
    setFormData(item);
    setSearchQuery(item.foodName);
    setEditingItem(index);
  };

  const deleteFoodItem = (index) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const getWeekData = (type, field) => {
    const weekData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();

      const dayEntries = entries[type].filter(
        (e) => new Date(e.date).toDateString() === dateString
      );

      const total = dayEntries.reduce(
        (sum, e) => sum + (parseFloat(e[field]) || 0),
        0
      );

      weekData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: total,
      });
    }

    return weekData;
  };

  const getBMICategory = (bmi) => {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5)
      return { text: "Underweight", className: "bmi-underweight" };
    if (bmiNum < 25) return { text: "Normal", className: "bmi-normal" };
    if (bmiNum < 30) return { text: "Overweight", className: "bmi-overweight" };
    return { text: "Obese", className: "bmi-obese" };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTodayTotal = (type, field) => {
    const today = new Date().toDateString();
    return entries[type]
      .filter((e) => new Date(e.date).toDateString() === today)
      .reduce((sum, e) => sum + (parseFloat(e[field]) || 0), 0);
  };

  return (
    <div className="health-tracker-container">
      <div className="health-tracker-wrapper">
        <div className="health-tracker-card">
          <div className="health-tracker-header">
            <h1 className="health-tracker-title">
              <Heart className="icon-lg" />
              Health Tracker
            </h1>
            <p className="health-tracker-subtitle">
              Track your daily health metrics
            </p>
          </div>

          <div className="tabs-container">
            <div className="tabs-wrapper">
              {[
                { id: "dashboard", label: "Dashboard", icon: Heart },
                { id: "water", label: "Water Intake", icon: Droplets },
                { id: "sleep", label: "Sleep", icon: Moon },
                { id: "calories", label: "Calories", icon: Utensils },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${
                    activeTab === tab.id ? "tab-active" : ""
                  }`}
                >
                  <tab.icon className="icon-sm" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="content-area">
            {activeTab === "dashboard" && (
              <div className="dashboard-content">
                <div className="dashboard-header">
                  <h2 className="section-title">Health Dashboard</h2>
                  <button
                    onClick={() => openAddModal("bmi")}
                    className="btn-primary"
                  >
                    <Plus className="icon-sm" />
                    Update BMI
                  </button>
                </div>

                <div className="stats-grid">
                  <div className="stat-card stat-water">
                    <div className="stat-header">
                      <h3 className="stat-title">Water Today</h3>
                      <Droplets className="stat-icon" />
                    </div>
                    <p className="stat-value">
                      {getTodayTotal("water", "amount")} ml
                    </p>
                    <p className="stat-label">Daily intake</p>
                  </div>

                  <div className="stat-card stat-sleep">
                    <div className="stat-header">
                      <h3 className="stat-title">Sleep Today</h3>
                      <Moon className="stat-icon" />
                    </div>
                    <p className="stat-value">
                      {getTodayTotal("sleep", "hours")} hrs
                    </p>
                    <p className="stat-label">Hours slept</p>
                  </div>

                  <div className="stat-card stat-calories">
                    <div className="stat-header">
                      <h3 className="stat-title">Calories Today</h3>
                      <Utensils className="stat-icon" />
                    </div>
                    <p className="stat-value">
                      {getTodayTotal("calories", "totalCalories")}
                    </p>
                    <p className="stat-label">Total intake</p>
                  </div>

                  <div className="stat-card stat-bmi">
                    <div className="stat-header">
                      <h3 className="stat-title">Current BMI</h3>
                      <Heart className="stat-icon" />
                    </div>
                    {entries.bmi.length > 0 ? (
                      <>
                        <p className="stat-value">{entries.bmi[0].bmi}</p>
                        <p
                          className={`stat-label ${
                            getBMICategory(entries.bmi[0].bmi).className
                          }`}
                        >
                          {getBMICategory(entries.bmi[0].bmi).text}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="stat-value stat-empty">--</p>
                        <p className="stat-label">No data</p>
                      </>
                    )}
                  </div>
                </div>

                {entries.bmi.length > 0 && (
                  <div className="bmi-details-card">
                    <h3 className="card-title">BMI Details</h3>
                    <div className="bmi-details-grid">
                      <div>
                        <p className="detail-label">Height</p>
                        <p className="detail-value">
                          {entries.bmi[0].height} cm
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">Weight</p>
                        <p className="detail-value">
                          {entries.bmi[0].weight} kg
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">BMI Index</p>
                        <p className="detail-value">{entries.bmi[0].bmi}</p>
                      </div>
                    </div>
                    <div className="detail-footer">
                      <p className="detail-timestamp">
                        Last updated: {formatDate(entries.bmi[0].date)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="recent-grid">
                  <div className="recent-card">
                    <h3 className="card-title">Recent Water Intake</h3>
                    <div className="recent-list">
                      {entries.water.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="recent-item">
                          <span className="recent-value">
                            {entry.amount} ml
                          </span>
                          <span className="recent-time">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                      ))}
                      {entries.water.length === 0 && (
                        <p className="empty-state">No entries yet</p>
                      )}
                    </div>
                  </div>

                  <div className="recent-card">
                    <h3 className="card-title">Recent Meals</h3>
                    <div className="recent-list">
                      {entries.calories.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="recent-item">
                          <span className="recent-value">
                            {entry.totalCalories} cal
                          </span>
                          <span className="recent-time">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                      ))}
                      {entries.calories.length === 0 && (
                        <p className="empty-state">No entries yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "water" && (
              <div>
                <div className="page-header">
                  <div>
                    <h2 className="section-title">Water Intake</h2>
                    <p className="page-subtitle">
                      Today: {getTodayTotal("water", "amount")} ml
                    </p>
                  </div>
                  <button
                    onClick={() => openAddModal("water")}
                    className="btn-water"
                  >
                    <Plus className="icon-sm" />
                    Add Entry
                  </button>
                </div>

                <div className="chart-card chart-water">
                  <h3 className="card-title">Last 7 Days</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getWeekData("water", "amount")}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Water (ml)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="entries-section">
                  <h3 className="entries-title">Recent Entries</h3>
                  {entries.water.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="entry-card">
                      <div>
                        <p className="entry-value">{entry.amount} ml</p>
                        <p className="entry-time">{formatDate(entry.date)}</p>
                      </div>
                      <button
                        onClick={() => deleteEntry("water", entry.id)}
                        className="btn-delete-icon"
                      >
                        <X className="icon-sm" />
                      </button>
                    </div>
                  ))}
                  {entries.water.length === 0 && (
                    <p className="empty-state-large">No water entries yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "sleep" && (
              <div>
                <div className="page-header">
                  <div>
                    <h2 className="section-title">Sleep</h2>
                    <p className="page-subtitle">
                      Today: {getTodayTotal("sleep", "hours")} hours
                    </p>
                  </div>
                  <button
                    onClick={() => openAddModal("sleep")}
                    className="btn-sleep"
                  >
                    <Plus className="icon-sm" />
                    Add Entry
                  </button>
                </div>

                <div className="chart-card chart-sleep">
                  <h3 className="card-title">Last 7 Days</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getWeekData("sleep", "hours")}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#9333ea"
                        strokeWidth={2}
                        name="Sleep (hours)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="entries-section">
                  <h3 className="entries-title">Recent Entries</h3>
                  {entries.sleep.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="entry-card">
                      <div>
                        <p className="entry-value">{entry.hours} hours</p>
                        <p className="entry-time">{formatDate(entry.date)}</p>
                        {entry.quality && (
                          <p className="entry-quality">
                            Quality: {entry.quality}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteEntry("sleep", entry.id)}
                        className="btn-delete-icon"
                      >
                        <X className="icon-sm" />
                      </button>
                    </div>
                  ))}
                  {entries.sleep.length === 0 && (
                    <p className="empty-state-large">No sleep entries yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "calories" && (
              <div>
                <div className="page-header">
                  <div>
                    <h2 className="section-title">Calories Intake</h2>
                    <p className="page-subtitle">
                      Today: {getTodayTotal("calories", "totalCalories")} cal
                    </p>
                  </div>
                  <button
                    onClick={() => openAddModal("calories")}
                    className="btn-calories"
                  >
                    <Plus className="icon-sm" />
                    Add Meal
                  </button>
                </div>

                <div className="entries-section">
                  {entries.calories.map((entry) => (
                    <div key={entry.id} className="meal-card">
                      <div className="meal-header">
                        <div>
                          <p className="meal-total">
                            {entry.totalCalories} calories
                          </p>
                          <p className="entry-time">{formatDate(entry.date)}</p>
                        </div>
                        <button
                          onClick={() => deleteEntry("calories", entry.id)}
                          className="btn-delete-icon"
                        >
                          <X className="icon-sm" />
                        </button>
                      </div>
                      <div className="meal-items">
                        {entry.items.map((item, idx) => (
                          <div key={idx} className="meal-item">
                            <span className="meal-item-name">
                              {item.foodName}
                            </span>
                            <span className="meal-item-cal">
                              {item.grams}g (
                              {(
                                (item.caloriesPer100g * item.grams) /
                                100
                              ).toFixed(0)}{" "}
                              cal)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {entries.calories.length === 0 && (
                    <p className="empty-state-large">No calorie entries yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === "water" && "Add Water Entry"}
                {modalType === "sleep" && "Add Sleep Entry"}
                {modalType === "calories" && "Add Meal"}
                {modalType === "bmi" && "Update BMI"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="modal-close"
              >
                <X className="icon-md" />
              </button>
            </div>

            <div className="modal-body">
              {modalType === "water" && (
                <div className="form-group">
                  <label className="form-label">Amount (ml)</label>
                  <input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="form-input"
                    placeholder="250"
                  />
                </div>
              )}

              {modalType === "bmi" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.height || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="form-input"
                      placeholder="170"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="form-input"
                      placeholder="70"
                    />
                  </div>
                  {formData.height && formData.weight && (
                    <div className="bmi-preview">
                      <p className="bmi-preview-label">Your BMI will be:</p>
                      <p className="bmi-preview-value">
                        {(
                          parseFloat(formData.weight) /
                          Math.pow(parseFloat(formData.height) / 100, 2)
                        ).toFixed(1)}
                      </p>
                      <p
                        className={`bmi-preview-category ${
                          getBMICategory(
                            (
                              parseFloat(formData.weight) /
                              Math.pow(parseFloat(formData.height) / 100, 2)
                            ).toFixed(1)
                          ).className
                        }`}
                      >
                        {
                          getBMICategory(
                            (
                              parseFloat(formData.weight) /
                              Math.pow(parseFloat(formData.height) / 100, 2)
                            ).toFixed(1)
                          ).text
                        }
                      </p>
                    </div>
                  )}
                </>
              )}

              {modalType === "sleep" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.hours || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, hours: e.target.value })
                      }
                      className="form-input"
                      placeholder="8"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quality (optional)</label>
                    <select
                      value={formData.quality || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, quality: e.target.value })
                      }
                      className="form-select"
                    >
                      <option value="">Select quality</option>
                      <option value="Poor">Poor</option>
                      <option value="Fair">Fair</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                </>
              )}

              {modalType === "calories" && (
                <>
                  <div className="food-add-section">
                    <h4 className="food-section-title">Add Food Item</h4>
                    <div className="food-form">
                      <div className="form-group food-search-group">
                        <label className="form-label">Food Name</label>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleFoodSearch(e.target.value)}
                          className="form-input"
                          placeholder="Search or type food name (e.g., Rice, Chicken)"
                        />
                        {filteredFoods.length > 0 && (
                          <div className="food-dropdown">
                            {filteredFoods.map((food) => (
                              <button
                                key={food}
                                onClick={() => selectFood(food)}
                                className="food-dropdown-item"
                              >
                                <p className="food-dropdown-name">{food}</p>
                                <p className="food-dropdown-cal">
                                  {foodDatabase[food]} cal per 100g
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="food-input-row">
                        <div className="form-group">
                          <label className="form-label">Grams</label>
                          <input
                            type="number"
                            value={formData.grams || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                grams: e.target.value,
                              })
                            }
                            className="form-input"
                            placeholder="150"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Total Calories</label>
                          <div className="calories-display">
                            <span className="calories-number">
                              {formData.grams && formData.caloriesPer100g
                                ? (
                                    (formData.caloriesPer100g *
                                      formData.grams) /
                                    100
                                  ).toFixed(0)
                                : "0"}{" "}
                              cal
                            </span>
                          </div>
                        </div>
                      </div>
                      {formData.grams && formData.caloriesPer100g && (
                        <div className="food-calculation">
                          <p className="food-calc-text">
                            <span className="food-calc-name">
                              {formData.foodName || "Food"}
                            </span>{" "}
                            • {formData.grams}g • {formData.caloriesPer100g}{" "}
                            cal/100g ={" "}
                            <span className="food-calc-total">
                              {(
                                (formData.caloriesPer100g * formData.grams) /
                                100
                              ).toFixed(0)}{" "}
                              calories
                            </span>
                          </p>
                        </div>
                      )}
                      <button onClick={addFoodItem} className="btn-add-food">
                        {editingItem !== null ? "Update Item" : "Add Item"}
                      </button>
                    </div>
                  </div>

                  {foodItems.length > 0 && (
                    <div className="food-items-list">
                      <h4 className="food-section-title">
                        Food Items in This Meal
                      </h4>
                      <div className="food-items-container">
                        {foodItems.map((item, index) => (
                          <div key={index} className="food-item-card">
                            <div>
                              <p className="food-item-name">{item.foodName}</p>
                              <p className="food-item-details">
                                {item.grams}g •{" "}
                                {(
                                  (item.caloriesPer100g * item.grams) /
                                  100
                                ).toFixed(0)}{" "}
                                calories
                              </p>
                            </div>
                            <div className="food-item-actions">
                              <button
                                onClick={() => editFoodItem(index)}
                                className="btn-edit-food"
                              >
                                <Edit2 className="icon-xs" />
                              </button>
                              <button
                                onClick={() => deleteFoodItem(index)}
                                className="btn-delete-food"
                              >
                                <X className="icon-xs" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="food-total">
                        <p className="food-total-text">
                          Total:{" "}
                          {foodItems
                            .reduce(
                              (sum, item) =>
                                sum + (item.caloriesPer100g * item.grams) / 100,
                              0
                            )
                            .toFixed(0)}{" "}
                          calories
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={handleSubmit}
                disabled={modalType === "calories" && foodItems.length === 0}
                className={`btn-submit ${
                  modalType === "calories" && foodItems.length === 0
                    ? "btn-disabled"
                    : ""
                }`}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
