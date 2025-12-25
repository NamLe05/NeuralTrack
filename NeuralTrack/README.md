# NeuralTrack - Patient MOCA/CDR Tracker

NeuralTrack is a cognitive monitoring dashboard designed for doctors to track patient MOCA tests and CDR scores over time.

## Project Structure

### Backend (`/backend`)
- **Node.js + TypeScript + Express**
- **MongoDB + Mongoose** for data persistence.
- **Controllers**: Placeholder functions for CRUD operations.
- **Models**: `Patient` and `MocaTest` schemas.
- **Routes**: Endpoints for patients and MOCA tests.

### Frontend (`/frontend`)
- **React + TypeScript + Vite**
- **Tailwind CSS** for styling.
- **Lucide React** for icons.
- **Axios** for API communication.
- **React Router** for navigation.

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with `MONGODB_URI` (optional, defaults to localhost).
4. `npm run dev` (starts on port 5001)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (starts on port 5173)

## Data Models

### Patient
- `oasisId`: Unique identifier (oasisid_x)
- `name`: Patient's full name
- `dob`: Date of birth
- `age`: Current age
- `currentCDR`: Clinical Dementia Rating (cdrtot)
- `cdrSum`: CDR Sum of Boxes (cdrsum)
- `mocaTests`: Array of MOCA test records

### MOCA Test
- `date`: Test date
- `totalScore`: Total MOCA score
- `subscores`: Abstraction, Recall, Orientation

## Future Integration
- **Azure ML API**: For predicting future CDR scores.
- **Advanced Visualization**: Graphs for tracking cognitive decline patterns.

