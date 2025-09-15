# AI Wellness Coach Backend - Complete Solution
# File: app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

class WellnessCoach:
    def __init__(self):
        self.diabetes_model = None
        self.heart_model = None
        self.hypertension_model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def create_synthetic_data(self, n_samples=1000):
        """Create synthetic health data for training"""
        np.random.seed(42)
        
        data = {
            'age': np.random.randint(18, 80, n_samples),
            'gender': np.random.choice([0, 1], n_samples),  # 0: Female, 1: Male
            'bmi': np.random.normal(26, 4, n_samples),
            'systolic_bp': np.random.normal(130, 20, n_samples),
            'diastolic_bp': np.random.normal(85, 15, n_samples),
            'glucose': np.random.normal(100, 30, n_samples),
            'cholesterol': np.random.normal(200, 40, n_samples),
            'heart_rate': np.random.normal(75, 15, n_samples),
            'exercise_hours': np.random.exponential(2, n_samples),
            'sleep_hours': np.random.normal(7, 1.5, n_samples),
            'stress_level': np.random.randint(1, 11, n_samples),
            'smoking': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
        }
        
        df = pd.DataFrame(data)
        
        # Create target variables based on realistic health correlations
        # Diabetes risk
        diabetes_prob = (
            0.1 + 
            (df['age'] - 18) / 620 +
            np.maximum(0, df['bmi'] - 25) / 100 +
            np.maximum(0, df['glucose'] - 100) / 500 +
            df['family_history'] * 0.2 +
            df['stress_level'] / 100
        )
        df['diabetes_risk'] = np.random.binomial(1, np.clip(diabetes_prob, 0, 1), n_samples)
        
        # Heart disease risk
        heart_prob = (
            0.05 +
            (df['age'] - 18) / 800 +
            np.maximum(0, df['systolic_bp'] - 120) / 400 +
            np.maximum(0, df['cholesterol'] - 200) / 600 +
            df['smoking'] * 0.25 +
            df['family_history'] * 0.15
        )
        df['heart_disease_risk'] = np.random.binomial(1, np.clip(heart_prob, 0, 1), n_samples)
        
        # Hypertension risk
        hyper_prob = (
            0.1 +
            (df['age'] - 18) / 500 +
            np.maximum(0, df['bmi'] - 25) / 80 +
            df['stress_level'] / 50 +
            df['smoking'] * 0.2
        )
        df['hypertension_risk'] = np.random.binomial(1, np.clip(hyper_prob, 0, 1), n_samples)
        
        return df
    
    def train_models(self):
        """Train all health risk prediction models"""
        print("Creating synthetic training data...")
        df = self.create_synthetic_data(2000)
        
        # Features for prediction
        feature_cols = ['age', 'gender', 'bmi', 'systolic_bp', 'diastolic_bp', 
                       'glucose', 'cholesterol', 'heart_rate', 'exercise_hours', 
                       'sleep_hours', 'stress_level', 'smoking', 'family_history']
        
        X = df[feature_cols]
        X_scaled = self.scaler.fit_transform(X)
        
        # Train diabetes model
        y_diabetes = df['diabetes_risk']
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_diabetes, test_size=0.2, random_state=42)
        self.diabetes_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.diabetes_model.fit(X_train, y_train)
        print(f"Diabetes Model Accuracy: {accuracy_score(y_test, self.diabetes_model.predict(X_test)):.3f}")
        
        # Train heart disease model
        y_heart = df['heart_disease_risk']
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_heart, test_size=0.2, random_state=42)
        self.heart_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.heart_model.fit(X_train, y_train)
        print(f"Heart Disease Model Accuracy: {accuracy_score(y_test, self.heart_model.predict(X_test)):.3f}")
        
        # Train hypertension model
        y_hyper = df['hypertension_risk']
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_hyper, test_size=0.2, random_state=42)
        self.hypertension_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.hypertension_model.fit(X_train, y_train)
        print(f"Hypertension Model Accuracy: {accuracy_score(y_test, self.hypertension_model.predict(X_test)):.3f}")
        
        self.is_trained = True
        print("All models trained successfully!")
        
    def predict_risks(self, user_data):
        """Predict health risks for user"""
        if not self.is_trained:
            return {"error": "Models not trained yet"}
            
        # Convert user data to model input format
        features = np.array([[
            user_data.get('age', 35),
            1 if user_data.get('gender', 'male').lower() == 'male' else 0,
            user_data.get('bmi', 25),
            user_data.get('systolic_bp', 120),
            user_data.get('diastolic_bp', 80),
            user_data.get('glucose', 100),
            user_data.get('cholesterol', 200),
            user_data.get('heart_rate', 75),
            user_data.get('exercise_hours', 3),
            user_data.get('sleep_hours', 7),
            user_data.get('stress_level', 5),
            1 if user_data.get('smoking', False) else 0,
            1 if user_data.get('family_history', False) else 0
        ]])
        
        features_scaled = self.scaler.transform(features)
        
        # Get predictions and probabilities
        diabetes_risk = self.diabetes_model.predict_proba(features_scaled)[0][1]
        heart_risk = self.heart_model.predict_proba(features_scaled)[0][1]
        hyper_risk = self.hypertension_model.predict_proba(features_scaled)[0][1]
        
        return {
            'diabetes_risk': float(diabetes_risk),
            'heart_disease_risk': float(heart_risk),
            'hypertension_risk': float(hyper_risk)
        }
    
    def get_feature_importance(self, condition):
        """Get feature importance for explainability"""
        feature_names = ['age', 'gender', 'bmi', 'systolic_bp', 'diastolic_bp', 
                        'glucose', 'cholesterol', 'heart_rate', 'exercise_hours', 
                        'sleep_hours', 'stress_level', 'smoking', 'family_history']
        
        if condition == 'diabetes' and self.diabetes_model:
            importance = self.diabetes_model.feature_importances_
        elif condition == 'heart_disease' and self.heart_model:
            importance = self.heart_model.feature_importances_
        elif condition == 'hypertension' and self.hypertension_model:
            importance = self.hypertension_model.feature_importances_
        else:
            return {}
            
        return dict(zip(feature_names, importance))

# Initialize wellness coach
coach = WellnessCoach()

def get_personalized_recommendations(user_data, risk_scores):
    """Generate personalized wellness recommendations"""
    recommendations = {
        'diet': [],
        'exercise': [],
        'lifestyle': [],
        'medical': []
    }
    
    # Diabetes recommendations
    if risk_scores['diabetes_risk'] > 0.3:
        recommendations['diet'].extend([
            "Reduce refined sugar intake and opt for complex carbohydrates",
            "Include more fiber-rich foods like vegetables and whole grains",
            "Monitor portion sizes and consider smaller, frequent meals"
        ])
        recommendations['exercise'].append("Aim for 150 minutes of moderate aerobic activity per week")
        recommendations['medical'].append("Consider regular blood glucose monitoring")
    
    # Heart disease recommendations
    if risk_scores['heart_disease_risk'] > 0.3:
        recommendations['diet'].extend([
            "Limit saturated fats and increase omega-3 fatty acids",
            "Reduce sodium intake to less than 2300mg per day",
            "Include heart-healthy foods like nuts, fish, and olive oil"
        ])
        recommendations['exercise'].append("Include both cardio and strength training exercises")
        recommendations['medical'].append("Monitor cholesterol levels regularly")
    
    # Hypertension recommendations
    if risk_scores['hypertension_risk'] > 0.3:
        recommendations['diet'].extend([
            "Follow DASH diet principles with plenty of fruits and vegetables",
            "Limit alcohol consumption",
            "Reduce caffeine intake if sensitive"
        ])
        recommendations['lifestyle'].extend([
            "Practice stress management techniques like meditation",
            "Ensure adequate sleep (7-9 hours nightly)",
            "Maintain a healthy weight"
        ])
        recommendations['medical'].append("Monitor blood pressure regularly")
    
    # General recommendations based on user data
    if user_data.get('bmi', 25) > 30:
        recommendations['lifestyle'].append("Consider a structured weight management program")
        
    if user_data.get('exercise_hours', 3) < 2:
        recommendations['exercise'].append("Gradually increase physical activity starting with 30-minute walks")
        
    if user_data.get('stress_level', 5) > 7:
        recommendations['lifestyle'].extend([
            "Consider stress reduction techniques like yoga or meditation",
            "Ensure adequate work-life balance"
        ])
    
    if user_data.get('sleep_hours', 7) < 6:
        recommendations['lifestyle'].append("Prioritize sleep hygiene and aim for 7-9 hours nightly")
    
    return recommendations

def generate_explanation(user_data, risk_scores, feature_importance):
    """Generate natural language explanations for predictions"""
    explanations = {}
    
    for condition, risk in risk_scores.items():
        condition_name = condition.replace('_', ' ').title()
        risk_level = "High" if risk > 0.7 else "Moderate" if risk > 0.3 else "Low"
        
        explanation = f"Your {condition_name} risk is {risk_level} ({risk:.1%}). "
        
        # Get top 3 contributing factors
        if condition == 'diabetes_risk':
            importance = feature_importance.get('diabetes', {})
        elif condition == 'heart_disease_risk':
            importance = feature_importance.get('heart_disease', {})
        else:
            importance = feature_importance.get('hypertension', {})
        
        if importance:
            top_factors = sorted(importance.items(), key=lambda x: x[1], reverse=True)[:3]
            factor_names = {
                'age': f'age ({user_data.get("age", "N/A")} years)',
                'bmi': f'BMI ({user_data.get("bmi", "N/A")})',
                'systolic_bp': f'systolic blood pressure ({user_data.get("systolic_bp", "N/A")} mmHg)',
                'glucose': f'glucose level ({user_data.get("glucose", "N/A")} mg/dL)',
                'smoking': 'smoking status',
                'family_history': 'family history'
            }
            
            factors_text = ", ".join([factor_names.get(factor[0], factor[0]) for factor in top_factors])
            explanation += f"Key contributing factors include: {factors_text}."
        
        explanations[condition] = explanation
    
    return explanations

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "models_trained": coach.is_trained})

@app.route('/api/train', methods=['POST'])
def train_models():
    """Train the ML models"""
    try:
        coach.train_models()
        return jsonify({"message": "Models trained successfully", "status": "success"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/api/predict', methods=['POST'])
def predict_health_risks():
    """Main prediction endpoint"""
    try:
        user_data = request.json
        
        # Validate required fields
        required_fields = ['age', 'gender', 'bmi', 'systolic_bp', 'diastolic_bp']
        missing_fields = [field for field in required_fields if field not in user_data]
        
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}",
                "status": "error"
            }), 400
        
        # Get risk predictions
        risk_scores = coach.predict_risks(user_data)
        
        if "error" in risk_scores:
            return jsonify(risk_scores), 400
        
        # Get feature importance for explainability
        feature_importance = {
            'diabetes': coach.get_feature_importance('diabetes'),
            'heart_disease': coach.get_feature_importance('heart_disease'),
            'hypertension': coach.get_feature_importance('hypertension')
        }
        
        # Generate recommendations
        recommendations = get_personalized_recommendations(user_data, risk_scores)
        
        # Generate explanations
        explanations = generate_explanation(user_data, risk_scores, feature_importance)
        
        # Compile response
        response = {
            "user_profile": user_data,
            "risk_assessment": risk_scores,
            "recommendations": recommendations,
            "explanations": explanations,
            "feature_importance": feature_importance,
            "status": "success"
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get recommendations based on specific condition"""
    try:
        data = request.json
        condition = data.get('condition')
        user_data = data.get('user_data', {})
        
        # Generate condition-specific recommendations
        recommendations = []
        
        if condition == 'diabetes':
            recommendations = [
                "Monitor blood glucose levels regularly",
                "Follow a low-glycemic diet",
                "Exercise for at least 30 minutes daily",
                "Maintain a healthy weight",
                "Take medications as prescribed"
            ]
        elif condition == 'heart_disease':
            recommendations = [
                "Follow a heart-healthy diet low in saturated fats",
                "Exercise regularly with both cardio and strength training",
                "Monitor blood pressure and cholesterol",
                "Manage stress effectively",
                "Avoid smoking and limit alcohol"
            ]
        elif condition == 'hypertension':
            recommendations = [
                "Follow the DASH diet",
                "Limit sodium intake",
                "Exercise regularly",
                "Manage stress through relaxation techniques",
                "Monitor blood pressure at home"
            ]
        
        return jsonify({
            "condition": condition,
            "recommendations": recommendations,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == '__main__':
    # Train models on startup
    print("Training models on startup...")
    coach.train_models()
    
    print("\n=== AI Wellness Coach API Started ===")
    print("Available endpoints:")
    print("- GET  /api/health - Health check")
    print("- POST /api/train - Train models")
    print("- POST /api/predict - Get health risk predictions")
    print("- POST /api/recommendations - Get condition-specific recommendations")
    print("=====================================\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)