from http.server import BaseHTTPRequestHandler
import json
import joblib
import pandas as pd
import numpy as np
import os

# Base directory for the project on Vercel
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load models
current_model_path = os.path.join(BASE_DIR, 'ml_models/current_model/moca_current_model.joblib')
projection_model_path = os.path.join(BASE_DIR, 'ml_models/future_model/moca_projection_model.joblib')

# Global variables to cache models
current_model_data = None
projection_model_data = None

def load_models():
    global current_model_data, projection_model_data
    if current_model_data is None:
        current_model_data = joblib.load(current_model_path)
    if projection_model_data is None:
        projection_model_data = joblib.load(projection_model_path)

def run_prediction(input_data):
    load_models()
    
    if not input_data:
        return {"error": "No assessment data provided"}

    results = []
    prev_moca = None
    prev_days = None
    all_mocas = []
    
    for i, assess in enumerate(input_data):
        mocatots = assess['totalScore']
        days = assess['days_to_visit']
        
        all_mocas.append(mocatots)
        visit_number = i + 1
        
        decline_rate = 0
        if prev_moca is not None and prev_days is not None:
            years_elapsed = (days - prev_days) / 365.25
            if years_elapsed > 0:
                decline_rate = (mocatots - prev_moca) / years_elapsed
        
        avg_mocatots = np.mean(all_mocas)
        sub = assess['subscores']
        mem_orient = sub['memory_recall'] * sub['orientation']
        exec_atten = sub['visuospatialExec'] * sub['attention']
        age_moca = assess['age'] * mocatots
        
        subdomain_vals = [
            sub['visuospatialExec'], sub['naming'], sub['attention'],
            sub['language'], sub['abstraction'], sub['memory_recall'], sub['orientation']
        ]
        cog_variance = np.std(subdomain_vals)
        
        features = [
            assess['age'], mocatots, sub['visuospatialExec'], sub['naming'], sub['attention'],
            sub['language'], sub['abstraction'], sub['memory_recall'], sub['orientation'],
            mem_orient, exec_atten, age_moca, sub['memory_recall'], sub['visuospatialExec'], cog_variance,
            visit_number, decline_rate, avg_mocatots
        ]
        
        current_pred_idx = current_model_data['model'].predict([features])[0]
        current_pred_val = float(current_model_data['rev_label_map'][str(current_pred_idx)])
        current_probs = current_model_data['model'].predict_proba([features])[0]
        current_confidence = float(np.max(current_probs))
        
        future_pred_val = None
        future_confidence = None
        if i == len(input_data) - 1:
            proj_features = features + [365.0]
            future_pred_idx = projection_model_data['model'].predict([proj_features])[0]
            future_pred_val = float(projection_model_data['rev_label_map'][str(future_pred_idx)])
            future_probs = projection_model_data['model'].predict_proba([proj_features])[0]
            future_confidence = float(np.max(future_probs))

        results.append({
            "date": assess['date'],
            "current_cdr": current_pred_val,
            "current_confidence": current_confidence,
            "future_cdr": future_pred_val,
            "future_confidence": future_confidence,
            "decline_rate": decline_rate,
            "visit_number": visit_number
        })
        
        prev_moca = mocatots
        prev_days = days

    return results

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data)
            output = run_prediction(data)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(output).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

