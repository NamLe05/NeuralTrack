import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import GroupKFold, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

def train_future_projection_model():
    # 1. Configuration
    output_dir = 'future_model'
    data_path = 'data_future.csv'
    os.makedirs(output_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found. Run process_data.py first.")
        return

    # 2. Load Data
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} rows for 1-year CDR projection.")

    features = [
        'age', 'mocatots', 'visuospatial_exec', 'naming', 'attention', 
        'language', 'abstraction', 'memory_recall', 'orientation',
        'mem_orient', 'exec_atten', 'age_moca', 'raw_recall', 'raw_exec', 'cog_variance',
        'visit_number', 'decline_rate', 'avg_mocatots', 'gap'
    ]
    X = df[features]
    
    # Classification labels: 0.0->0, 0.5->1, 1.0->2, 2.0->3, 3.0->4
    label_map = {0.0: 0, 0.5: 1, 1.0: 2, 2.0: 3, 3.0: 4}
    y = df['future_cdrtot'].map(label_map)
    groups = df['oasisid']

    # Sample Weighting
    weights_map = {0: 1.0, 1: 2.0, 2: 3.0, 3: 5.0, 4: 5.0}
    sample_weights = y.map(weights_map)

    # 3. Setup Grouped Cross-Validation (5-Fold)
    gkf = GroupKFold(n_splits=5)

    # 4. Hyperparameter Tuning
    print("\nStarting Hyperparameter Tuning for 1-Year Projection...")
    param_grid = {
        'max_depth': [3, 4, 5],
        'learning_rate': [0.01, 0.05],
        'n_estimators': [200, 500],
        'subsample': [0.8, 0.9],
        'colsample_bytree': [0.8, 0.9],
        'eval_metric': ['mlogloss']
    }

    xgb_clf = xgb.XGBClassifier(use_label_encoder=False, random_state=42)
    
    grid_search = GridSearchCV(
        estimator=xgb_clf,
        param_grid=param_grid,
        cv=gkf,
        scoring='accuracy',
        verbose=1,
        n_jobs=-1
    )

    grid_search.fit(X, y, groups=groups, sample_weight=sample_weights)
    
    best_model = grid_search.best_estimator_
    print(f"\nBest Projection Parameters: {grid_search.best_params_}")

    # 5. Final Evaluation via Cross-Validation
    print("\nPerforming Final Cross-Validation Evaluation for Future Projection...")
    accuracies = []
    all_y_true = []
    all_y_pred = []

    for train_idx, test_idx in gkf.split(X, y, groups=groups):
        X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
        y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
        sw_train = sample_weights.iloc[train_idx]
        
        fold_model = xgb.XGBClassifier(**grid_search.best_params_, use_label_encoder=False, random_state=42)
        fold_model.fit(X_train, y_train, sample_weight=sw_train)
        
        preds = fold_model.predict(X_test)
        accuracies.append(accuracy_score(y_test, preds))
        
        all_y_true.extend(y_test)
        all_y_pred.extend(preds)

    avg_accuracy = np.mean(accuracies)
    print("\n" + "="*40)
    print("   MoCA-LONGITUDINAL 1-YEAR PROJECTION")
    print("="*40)
    print(f"Mean Accuracy: {avg_accuracy:.4f}")
    
    rev_label_map = {v: str(k) for k, v in label_map.items()}
    all_y_true_str = [rev_label_map[v] for v in all_y_true]
    all_y_pred_str = [rev_label_map[v] for v in all_y_pred]
    unique_labels = sorted(list(set(all_y_true_str)), key=float)

    print("\nAggregated Projection Classification Report:")
    print(classification_report(all_y_true_str, all_y_pred_str, labels=unique_labels))

    # 6. Generate and Save Visualizations
    cm = confusion_matrix(all_y_true_str, all_y_pred_str, labels=unique_labels)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Purples', 
                xticklabels=unique_labels, yticklabels=unique_labels)
    plt.title('MoCA-Longitudinal: 1-Year Projection Confusion Matrix')
    plt.ylabel('Actual Future CDR')
    plt.xlabel('Predicted Future CDR')
    plt.savefig(os.path.join(output_dir, 'projection_confusion_matrix.png'))

    importance = pd.DataFrame({
        'feature': features,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x='importance', y='feature', data=importance, palette='plasma')
    plt.title('Feature Importance (MoCA-Longitudinal Projection)')
    plt.savefig(os.path.join(output_dir, 'projection_feature_importance.png'))

    # 7. Save Final Model
    final_model = xgb.XGBClassifier(**grid_search.best_params_, use_label_encoder=False, random_state=42)
    final_model.fit(X, y, sample_weight=sample_weights)
    
    model_data = {
        'model': final_model,
        'features': features,
        'best_params': grid_search.best_params_,
        'label_map': label_map,
        'rev_label_map': rev_label_map
    }
    joblib.dump(model_data, os.path.join(output_dir, 'moca_projection_model.joblib'))
    print(f"\nAll projection files saved to '{output_dir}/' folder.")

if __name__ == "__main__":
    train_future_projection_model()
