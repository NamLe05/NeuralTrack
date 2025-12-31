import { spawn } from 'child_process';
import path from 'path';
import { IPatient } from '../models/Patient';

export interface MLPrediction {
  date: string;
  current_cdr: number;
  current_confidence: number;
  future_cdr: number | null;
  future_confidence: number | null;
  decline_rate: number;
  visit_number: number;
}

export const runMLPrediction = (patient: IPatient): Promise<MLPrediction[]> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../../ml_models/predict.py');
    
    // Format data for predict.py
    // sorted by date
    const sortedTests = [...patient.mocaTests].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedTests.length === 0) {
      return resolve([]);
    }

    const firstVisitDate = new Date(sortedTests[0].date).getTime();
    const dob = new Date(patient.dob).getTime();

    const inputData = sortedTests.map((test, index) => {
      const testDate = new Date(test.date).getTime();
      const ageAtVisit = (testDate - dob) / (1000 * 60 * 60 * 24 * 365.25);
      const daysToVisit = (testDate - firstVisitDate) / (1000 * 60 * 60 * 24);

      return {
        date: test.date,
        age: ageAtVisit,
        days_to_visit: daysToVisit,
        totalScore: test.totalScore,
        subscores: test.subscores
      };
    });

    const pythonProcess = spawn('python3', [scriptPath]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`ML script failed with code ${code}: ${errorOutput}`);
        return reject(new Error(errorOutput || 'ML Prediction failed'));
      }

      try {
        const results = JSON.parse(output);
        if (results.error) {
          return reject(new Error(results.error));
        }
        resolve(results);
      } catch (e) {
        reject(new Error('Failed to parse ML output'));
      }
    });

    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();
  });
};

