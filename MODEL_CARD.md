# Model Card: NeuralTrack Cognitive Predictor (XGBoost v2.1)

## 1. Model Details
*   **Developed by:** NeuralTrack Team
*   **Model Date:** December 2025
*   **Model Type:** Gradient Boosted Decision Trees (XGBoost)
*   **Framework:** `xgboost` v2.1.0, `scikit-learn`, `joblib`
*   **Task:** Multi-class Classification (Clinical Dementia Rating: 0.0, 0.5, 1.0, 2.0, 3.0)
*   **Architecture:** Gradient Boosted Trees with custom sample weighting for class imbalance.

## 2. Intended Use
*   **Primary Users:** Neurologists, Geriatricians, and Primary Care Physicians.
*   **Intended Context:** Used within the NeuralTrack clinical dashboard to provide probabilistic risk stratification for Alzheimer's and Dementia based on longitudinal MoCA scores.
*   **Out-of-Scope:** This model is **not** a diagnostic tool. It should not be used as the sole basis for clinical decision-making. It is a clinical decision support system (CDSS) intended to flag high-risk patients for expensive confirmatory tests (MRI, PET, CSF).

## 3. Training Architecture & Scripts
NeuralTrack utilizes two distinct pipelines to capture different clinical dimensions:

### A. Current Baseline Model (`train_current_cdr_pro.py`)
*   **Target:** Current `cdrtot` (Clinical Dementia Rating).
*   **Dataset:** `data_current.csv` (1,967 clinical sessions).
*   **Objective:** To accurately stage a patient's functional impairment based on their latest cognitive snapshot and longitudinal context.
*   **Key Features:** `mocatots`, `visuospatial_exec`, `naming`, `attention`, `language`, `abstraction`, `memory_recall`, `orientation`, `decline_rate`, `avg_mocatots`, `cog_variance`.
*   **Performance:** ~83.2% Mean Accuracy.

### B. 12-Month Projection Model (`train_future_cdr_pro.py`)
*   **Target:** `future_cdrtot` (Functional status 12 months post-assessment).
*   **Dataset:** `data_future.csv` (1,152 longitudinal pairs).
*   **Objective:** To forecast cognitive decline using the "Decline Rate" and "Gap" features.
*   **Additional Feature:** `gap` (Days between current and future assessment).
*   **Performance:** ~82.5% Mean Accuracy.

## 4. Training Protocol & Technical Specs
Both models share a rigorous training methodology to ensure clinical reliability:

*   **Grouped Cross-Validation (`GroupKFold`):** Crucial for longitudinal data. We ensure all records from a specific patient (`oasisid`) stay within the same fold, preventing the model from "memorizing" specific patients across time.
*   **Hyperparameter Optimization (`GridSearchCV`):**
    *   `max_depth`: [3, 4, 5] (Shallow trees to prevent overfitting on tabular data).
    *   `learning_rate`: [0.01, 0.05] (Slow learning for better generalization).
    *   `n_estimators`: [200, 500] (Iterative boosting stages).
    *   `subsample`/`colsample_bytree`: [0.8, 0.9] (Stochastic sampling for robustness).
*   **Class Imbalance Mitigation:** Higher weights are applied to rarer clinical stages to improve sensitivity:
    *   **CDR 0.0 (Normal):** 1.0x weight.
    *   **CDR 1.0 (Mild):** 2.0x–3.0x weight.
    *   **CDR 2.0/3.0 (Moderate/Severe):** 3.0x–5.0x weight.

## 5. Factors & Bias
*   **Demographics:** Trained on the OASIS-3 cohort (primarily ages 45-95).
*   **Educational Variance:** MoCA scores are historically sensitive to educational attainment; the model may over-index on cognitive scores for patients with fewer years of formal schooling.
*   **Clinical Heterogeneity:** Predictions may be less accurate for atypical dementias (e.g., Frontotemporal or Lewy Body) which present with different subdomain patterns than AD.

## 6. Interpretability (Translational Storytelling)
NeuralTrack provides **Global Feature Importance** visualizations.
*   **Recall & Orientation:** Consistently identified as the highest-weight features for differentiating CDR 0.0 from 0.5.
*   **Decline Rate:** The dominant feature in the 1-year projection, capturing the "velocity" of neurodegeneration.

## 7. Limitations
*   **Single-Visit Uncertainty:** Confidence is significantly lower for new patients where `decline_rate` cannot be calculated.
*   **Longitudinal Continuity:** The model assumes assessments are conducted under standardized conditions. Fluctuations due to acute illness or medication changes may impact reliability.

---
**Technical Contact:** NeuralTrack Development Team  
**Model License:** Proprietary Research (Hack4Health)
