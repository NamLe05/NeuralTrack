import sys
import json
import joblib
import pandas as pd
import numpy as np
import os

# Set base path to ml_models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models
current_model_path = os.path.join(BASE_DIR, 'current_model/moca_current_model.joblib')
projection_model_path = os.path.join(BASE_DIR, 'future_model/moca_projection_model.joblib')

try:
    current_model_data = joblib.load(current_model_path)
    projection_model_data = joblib.load(projection_model_path)
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

def run_prediction(input_data):
    # Expecting input_data to be a list of MoCa assessments for one patient
    # sorted by date.
    
    if not input_data:
        return {"error": "No assessment data provided"}

    # Features order (must match exactly as trained):
    # age, mocatots, visuospatial_exec, naming, attention, 
    # language, abstraction, memory_recall, orientation,
    # mem_orient, exec_atten, age_moca, raw_recall, raw_exec, cog_variance,
    # visit_number, decline_rate, avg_mocatots
    
    # Optional for projection: gap
    
    results = []
    
    # Process assessments sequentially to calculate longitudinal features
    prev_moca = None
    prev_days = None
    all_mocas = []
    
    for i, assess in enumerate(input_data):
        mocatots = assess['totalScore']
        days = assess['days_to_visit'] # days from baseline or absolute? 
        # In our dataset processing, we use days_to_visit (cumulative).
        
        all_mocas.append(mocatots)
        visit_number = i + 1
        
        # Calculate decline rate
        decline_rate = 0
        if prev_moca is not None and prev_days is not None:
            years_elapsed = (days - prev_days) / 365.25
            if years_elapsed > 0:
                decline_rate = (mocatots - prev_moca) / years_elapsed
        
        avg_mocatots = np.mean(all_mocas)
        
        # Interaction features
        sub = assess['subscores']
        mem_orient = sub['memory_recall'] * sub['orientation']
        exec_atten = sub['visuospatialExec'] * sub['attention']
        age_moca = assess['age'] * mocatots
        
        subdomain_vals = [
            sub['visuospatialExec'], sub['naming'], sub['attention'],
            sub['language'], sub['abstraction'], sub['memory_recall'], sub['orientation']
        ]
        cog_variance = np.std(subdomain_vals)
        
        # Prepare feature vector for Current Model
        features = [
            assess['age'], mocatots, sub['visuospatialExec'], sub['naming'], sub['attention'],
            sub['language'], sub['abstraction'], sub['memory_recall'], sub['orientation'],
            mem_orient, exec_atten, age_moca, sub['memory_recall'], sub['visuospatialExec'], cog_variance,
            visit_number, decline_rate, avg_mocatots
        ]
        
        # Predict Current CDR
        current_pred_idx = current_model_data['model'].predict([features])[0]
        current_pred_val = float(current_model_data['rev_label_map'][str(current_pred_idx)])
        
        # Probability for "confidence"
        current_probs = current_model_data['model'].predict_proba([features])[0]
        current_confidence = float(np.max(current_probs))
        
        # Future Projection (only for the most recent assessment)
        future_pred_val = None
        future_confidence = None
        if i == len(input_data) - 1:
            # Add gap (default 365 days for 1 year)
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

if __name__ == "__main__":
    try:
        input_json = sys.stdin.read()
        if not input_json:
            sys.exit(0)
        data = json.loads(input_json)
        output = run_prediction(data)
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

