import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Activity, Scan, CheckCircle } from 'lucide-react';
import { useDiagnosis } from '@/context/DiagnosisContext';
import { DiagnosisResult } from '@/types/patient';

const processingSteps = [
  { icon: Scan, label: 'Preprocessing image...', duration: 1500 },
  { icon: Brain, label: 'Running AI analysis...', duration: 2500 },
  { icon: Activity, label: 'Generating heatmap...', duration: 1500 },
  { icon: CheckCircle, label: 'Finalizing results...', duration: 1000 },
];

// Simulated AI results for demo
const simulatedResults: DiagnosisResult[] = [
  {
    disease: 'Normal',
    confidence: 94.5,
    severity: 'Low',
    affectedRegions: [],
    recommendations: [
      'No significant abnormalities detected',
      'Continue regular health checkups',
      'Maintain healthy lifestyle habits',
    ],
    heatmapUrl: '',
  },
  {
    disease: 'Pneumonia',
    confidence: 87.3,
    severity: 'Medium',
    affectedRegions: ['Right lower lobe', 'Left lower lobe'],
    recommendations: [
      'Consult a pulmonologist immediately',
      'Complete course of prescribed antibiotics',
      'Rest and stay hydrated',
      'Follow-up CT scan in 2-4 weeks',
    ],
    heatmapUrl: '',
  },
  {
    disease: 'COPD',
    confidence: 82.1,
    severity: 'Medium',
    affectedRegions: ['Upper lobes bilateral', 'Emphysematous changes'],
    recommendations: [
      'Smoking cessation is critical',
      'Pulmonary function tests recommended',
      'Consider bronchodilator therapy',
      'Pulmonary rehabilitation program',
    ],
    heatmapUrl: '',
  },
  {
    disease: 'Tuberculosis',
    confidence: 78.9,
    severity: 'High',
    affectedRegions: ['Right upper lobe', 'Cavitary lesion'],
    recommendations: [
      'Immediate isolation and specialist consultation',
      'Sputum culture and sensitivity test',
      'Start DOTS therapy as prescribed',
      'Contact tracing for close contacts',
    ],
    heatmapUrl: '',
  },
];

export function ProcessingAnimation() {
  const navigate = useNavigate();
  const { scanData, setDiagnosisResult } = useDiagnosis();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Redirect if no scan data
  useEffect(() => {
    if (!scanData) {
      navigate('/upload-scan');
    }
  }, [scanData, navigate]);

  useEffect(() => {
    if (!scanData) return;

    const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
    }, 50);

    // Step progression
    let stepTimeout: NodeJS.Timeout;
    let accumulatedTime = 0;

    processingSteps.forEach((step, index) => {
      stepTimeout = setTimeout(() => {
        setCurrentStep(index);
      }, accumulatedTime);
      accumulatedTime += step.duration;
    });

    // Complete processing
    const completeTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Simulate AI result (random for demo)
      const randomResult = simulatedResults[Math.floor(Math.random() * simulatedResults.length)];
      setDiagnosisResult(randomResult);
      
      setTimeout(() => {
        navigate('/results');
      }, 500);
    }, totalDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
      clearTimeout(completeTimeout);
    };
  }, [scanData, navigate, setDiagnosisResult]);

  const CurrentIcon = processingSteps[currentStep]?.icon || Brain;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto px-4"
      >
        {/* Animated Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
          />
          
          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border-4 border-accent/20 border-b-accent"
          />

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <CurrentIcon className="w-8 h-8 text-primary-foreground" />
            </motion.div>
          </div>
        </div>

        {/* Status Text */}
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-xl font-semibold mb-2"
        >
          {processingSteps[currentStep]?.label}
        </motion.h2>

        <p className="text-sm text-muted-foreground mb-6">
          Analyzing lung regions using advanced deep learning
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          {Math.round(progress)}% complete
        </p>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {processingSteps.map((step, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}