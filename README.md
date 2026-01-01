# NeuralTrack: AI-Powered Alzheimer’s Risk Stratification

NeuralTrack is a clinical decision-support platform that leverages machine learning to bridge the gap between low-cost cognitive screening (MoCA) and functional dementia staging (CDR). By analyzing longitudinal patient data, NeuralTrack provides doctors with real-time risk assessments and 12-month cognitive projections.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
   *Note: If `MONGODB_URI` is omitted, it will attempt to connect to `mongodb://localhost:27017/neuraltrack`.*
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

##  Demo Mode
For rapid testing, a **Dev Bypass** button is available on the login page. This allows you to explore the dashboard and patient registry without a live database connection (using local storage simulation).

##  Future Goals

### Model Refinement
- **Azure ML Integration**: Migrate predictive pipelines to Azure Machine Learning for scalable, enterprise-grade inference.
- **Assessment Expansion**: Support additional cognitive assessments beyond the MoCA (e.g., Mini-Mental State Exam, Clock Drawing Test).
- **Data Integration**: Utilize larger, more diverse datasets (e.g., ADNI, NACC) to improve predictive accuracy across varied demographics.
- **Precision Detection**: Refine subdomain analysis to identify the subtlest signatures of early cognitive decline.

### Scale & Integration
- **API Service**: Expose prediction models as a global API to power third-party assessment tools and research platforms.
- **Clinical Readiness**: Transform the dashboard into a HIPAA-compliant, production-ready platform for clinical environments.
- **Deployment & Testing**: Integrate NeuralTrack directly into Electronic Health Record (EHR) systems for seamless provider workflows.

---
**Disclaimer**: NeuralTrack is a clinical decision-support tool designed for researchers and healthcare professionals. It is not a replacement for clinical diagnosis.
