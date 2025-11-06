// const { spawn } = require('child_process');
// const path = require('path');

// // ML Service to communicate with Python ML model
// const analyzeWithML = async (mlData) => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Path to your Python ML script
//       // Adjust this path to point to your ML folder
//       const pythonScriptPath = path.join(__dirname, '../../ml/predict.py');
      
//       // Spawn Python process
//       const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(mlData)]);

//       let result = '';
//       let error = '';

//       pythonProcess.stdout.on('data', (data) => {
//         result += data.toString();
//       });

//       pythonProcess.stderr.on('data', (data) => {
//         error += data.toString();
//       });

//       pythonProcess.on('close', (code) => {
//         if (code !== 0) {
//           console.error('Python process error:', error);
//           reject(new Error(`ML process failed with code ${code}: ${error}`));
//           return;
//         }

//         try {
//           const parsedResult = JSON.parse(result);
//           resolve(parsedResult);
//         } catch (parseError) {
//           console.error('Error parsing ML result:', parseError);
//           reject(new Error('Invalid response from ML model'));
//         }
//       });

//       pythonProcess.on('error', (error) => {
//         console.error('Failed to start Python process:', error);
//         reject(new Error('ML service unavailable'));
//       });

//     } catch (error) {
//       console.error('Error in ML service:', error);
      
//       // Fallback: Return a default prediction if ML service fails
//       resolve({
//         prediction: 'normal',
//         confidence: 0.5,
//         details: { fallback: true, error: error.message }
//       });
//     }
//   });
// };

// // Alternative: HTTP-based ML service (if your ML model runs as a separate service)
// const analyzeWithMLHttp = async (mlData) => {
//   try {
//     const response = await fetch('http://localhost:8000/predict', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(mlData)
//     });

//     if (!response.ok) {
//       throw new Error(`ML service responded with status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;

//   } catch (error) {
//     console.error('HTTP ML service error:', error);
    
//     // Fallback response
//     return {
//       prediction: 'normal',
//       confidence: 0.5,
//       details: { fallback: true, error: error.message }
//     };
//   }
// };

// module.exports = {
//   analyzeWithML,
//   analyzeWithMLHttp
// };

// Simple ML service for testing - replace with actual Python integration later
const analyzeWithML = async (mlData) => {
  try {
    // Mock ML analysis - replace this with actual Python integration
    console.log('ML Analysis Request:', mlData);
    
    // Simple rule-based analysis for testing
    const crossCount = mlData.cross_count || 0;
    const duration = mlData.duration || 24;
    const temperature = mlData.temperature || 25;
    
    let prediction = 'normal';
    let confidence = 0.7;
    
    // Simple rules for testing
    if (crossCount > 8) {
      prediction = 'anomalous';
      confidence = 0.85;
    } else if (crossCount > 5 && duration < 12) {
      prediction = 'anomalous';
      confidence = 0.75;
    } else if (crossCount > 3 && temperature > 35) {
      prediction = 'anomalous';
      confidence = 0.65;
    } else {
      prediction = 'normal';
      confidence = 0.9;
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      prediction,
      confidence,
      details: {
        cross_count_analysis: crossCount,
        duration_analysis: duration,
        temperature_analysis: temperature,
        rules_applied: ['cross_count', 'duration', 'temperature']
      }
    };
    
  } catch (error) {
    console.error('ML Service Error:', error);
    // Fallback response
    return {
      prediction: 'normal',
      confidence: 0.5,
      details: { 
        fallback: true, 
        error: error.message 
      }
    };
  }
};

module.exports = {
  analyzeWithML
};

