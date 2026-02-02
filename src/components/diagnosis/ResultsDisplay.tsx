import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  RotateCcw, 
  Activity,
  MapPin,
  TrendingUp,
  FileText,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiagnosis } from '@/context/DiagnosisContext';
import { toast } from 'sonner';

const severityConfig = {
  Low: { color: 'bg-success text-success-foreground', icon: CheckCircle },
  Medium: { color: 'bg-warning text-warning-foreground', icon: AlertTriangle },
  High: { color: 'bg-destructive text-destructive-foreground', icon: AlertTriangle },
};

const diseaseConfig = {
  Normal: { color: 'text-success', bgColor: 'bg-success/10' },
  Pneumonia: { color: 'text-warning', bgColor: 'bg-warning/10' },
  Tuberculosis: { color: 'text-destructive', bgColor: 'bg-destructive/10' },
  COPD: { color: 'text-primary', bgColor: 'bg-primary/10' },
  'Lung Cancer': { color: 'text-destructive', bgColor: 'bg-destructive/10' },
};

export function ResultsDisplay() {
  const navigate = useNavigate();
  const { patientData, diagnosisResult, resetDiagnosis } = useDiagnosis();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redirect if no results
  useEffect(() => {
    if (!diagnosisResult || !patientData) {
      navigate('/');
    }
  }, [diagnosisResult, patientData, navigate]);

  // Draw simulated heatmap
  useEffect(() => {
    if (canvasRef.current && diagnosisResult) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 400;
      canvas.height = 400;

      // Draw lung silhouette background
      ctx.fillStyle = '#1a2332';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw lung outline
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      // Left lung
      ctx.beginPath();
      ctx.ellipse(140, 200, 80, 150, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Right lung
      ctx.beginPath();
      ctx.ellipse(260, 200, 80, 150, 0, 0, Math.PI * 2);
      ctx.stroke();

      // If not normal, draw heatmap regions
      if (diagnosisResult.disease !== 'Normal') {
        const gradient = ctx.createRadialGradient(
          diagnosisResult.disease === 'Pneumonia' ? 260 : 140, 
          180, 10,
          diagnosisResult.disease === 'Pneumonia' ? 260 : 140, 
          180, 80
        );
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add secondary affected region for some conditions
        if (diagnosisResult.affectedRegions.length > 1) {
          const gradient2 = ctx.createRadialGradient(180, 280, 10, 180, 280, 60);
          gradient2.addColorStop(0, 'rgba(245, 158, 11, 0.7)');
          gradient2.addColorStop(0.7, 'rgba(34, 197, 94, 0.2)');
          gradient2.addColorStop(1, 'rgba(34, 197, 94, 0)');
          
          ctx.fillStyle = gradient2;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Draw "HEATMAP" label
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter';
      ctx.fillText('Grad-CAM Visualization', 10, 20);
    }
  }, [diagnosisResult]);

  if (!diagnosisResult || !patientData) {
    return null;
  }

  const disease = diseaseConfig[diagnosisResult.disease];
  const severity = severityConfig[diagnosisResult.severity];
  const SeverityIcon = severity.icon;

  const handleDownloadReport = () => {
    // In production, this would generate a PDF
    toast.success('Report download started');
  };

  const handleNewDiagnosis = () => {
    resetDiagnosis();
    navigate('/patient-details');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Result Header */}
      <div className="medical-card text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${disease.bgColor} mb-4`}
        >
          <Activity className={`w-10 h-10 ${disease.color}`} />
        </motion.div>

        <h1 className="font-display text-3xl font-bold mb-2">
          Analysis Complete
        </h1>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className={`text-2xl font-bold ${disease.color}`}>
            {diagnosisResult.disease}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${severity.color}`}>
            <SeverityIcon className="w-4 h-4 inline mr-1" />
            {diagnosisResult.severity} Severity
          </span>
        </div>

        {/* Confidence Score */}
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-semibold">{diagnosisResult.confidence.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${diagnosisResult.confidence}%` }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Heatmap Visualization */}
        <div className="medical-card">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Affected Regions
          </h3>
          
          <div className="aspect-square rounded-xl overflow-hidden bg-foreground/5 mb-4">
            <canvas 
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          {diagnosisResult.affectedRegions.length > 0 ? (
            <ul className="space-y-2">
              {diagnosisResult.affectedRegions.map((region, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {region}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-success">
              No abnormal regions detected
            </p>
          )}
        </div>

        {/* Recommendations */}
        <div className="medical-card">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recommendations
          </h3>
          
          <ul className="space-y-3">
            {diagnosisResult.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="text-sm">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Patient Summary */}
      <div className="medical-card">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Patient Summary
        </h3>
        
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <p className="font-medium">{patientData.fullName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Age / Gender:</span>
            <p className="font-medium">{patientData.age} / {patientData.gender}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Contact:</span>
            <p className="font-medium">{patientData.email}</p>
          </div>
        </div>

        {patientData.symptoms.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-muted-foreground text-sm">Reported Symptoms:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {patientData.symptoms.map((symptom) => (
                <span key={symptom} className="px-2 py-1 bg-secondary rounded text-xs">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-xl">
        <Shield className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Important Medical Notice</p>
          <p className="text-xs text-muted-foreground mt-1">
            This is an AI-assisted diagnostic result and should not be considered as a definitive medical diagnosis. 
            Please consult with a qualified healthcare professional for proper medical evaluation and treatment decisions.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={handleNewDiagnosis}
          className="flex-1 gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Diagnosis
        </Button>
        <Button 
          onClick={handleDownloadReport}
          className="flex-1 gap-2"
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>
    </motion.div>
  );
}