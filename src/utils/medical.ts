// Medical database utilities and references

export interface DrugInfo {
  name: string;
  genericName?: string;
  category: string;
  dosage: string;
  commonUses: string[];
  sideEffects: string[];
  interactions?: string[];
}

export interface MedicalCondition {
  name: string;
  icdCode: string;
  category: string;
  description: string;
  symptoms: string[];
  commonTreatments: string[];
}

// Common medical specialties
export const MEDICAL_SPECIALTIES = [
  { value: "cardiology", label: "Cardiology", description: "Heart and cardiovascular system" },
  { value: "neurology", label: "Neurology", description: "Brain and nervous system" },
  { value: "orthopedics", label: "Orthopedics", description: "Bones, joints, and muscles" },
  { value: "pediatrics", label: "Pediatrics", description: "Children's health" },
  { value: "dermatology", label: "Dermatology", description: "Skin conditions" },
  { value: "psychiatry", label: "Psychiatry", description: "Mental health" },
  { value: "gastroenterology", label: "Gastroenterology", description: "Digestive system" },
  { value: "endocrinology", label: "Endocrinology", description: "Hormones and metabolism" },
  { value: "pulmonology", label: "Pulmonology", description: "Respiratory system" },
  { value: "nephrology", label: "Nephrology", description: "Kidney diseases" },
  { value: "oncology", label: "Oncology", description: "Cancer treatment" },
  { value: "general", label: "General Medicine", description: "General practice" },
];

// Common urgency levels and their descriptions
export const URGENCY_LEVELS = {
  low: {
    label: "Low",
    description: "Routine consultation, can wait",
    color: "text-success",
  },
  medium: {
    label: "Medium",
    description: "Important but not urgent",
    color: "text-warning",
  },
  high: {
    label: "High",
    description: "Requires prompt attention",
    color: "text-error",
  },
  emergency: {
    label: "Emergency",
    description: "Immediate attention required",
    color: "text-error",
  },
};

// Vital signs reference ranges
export const VITAL_SIGNS_RANGES = {
  heartRate: {
    label: "Heart Rate",
    unit: "bpm",
    normal: { min: 60, max: 100 },
    ranges: {
      low: { max: 60, label: "Bradycardia" },
      normal: { min: 60, max: 100, label: "Normal" },
      high: { min: 100, label: "Tachycardia" },
    },
  },
  bloodPressure: {
    label: "Blood Pressure",
    unit: "mmHg",
    systolic: {
      normal: { min: 90, max: 120 },
      ranges: {
        low: { max: 90, label: "Low" },
        normal: { min: 90, max: 120, label: "Normal" },
        elevated: { min: 120, max: 129, label: "Elevated" },
        high: { min: 130, label: "High" },
      },
    },
    diastolic: {
      normal: { min: 60, max: 80 },
    },
  },
  temperature: {
    label: "Body Temperature",
    unit: "°C",
    normal: { min: 36.5, max: 37.5 },
    ranges: {
      low: { max: 36.5, label: "Hypothermia" },
      normal: { min: 36.5, max: 37.5, label: "Normal" },
      fever: { min: 37.5, max: 39, label: "Fever" },
      high: { min: 39, label: "High Fever" },
    },
  },
  respiratoryRate: {
    label: "Respiratory Rate",
    unit: "breaths/min",
    normal: { min: 12, max: 20 },
  },
};

/**
 * Format medical condition with ICD code
 */
export const formatIcdCode = (code: string): string => {
  return code.replace(/^([A-Z]\d{2})(\d)/, "$1.$2");
};

/**
 * Validate vital sign value
 */
export const validateVitalSign = (
  type: keyof typeof VITAL_SIGNS_RANGES,
  value: number
): { status: "low" | "normal" | "high" | "critical"; message: string } => {
  if (type === "heartRate") {
    const vital = VITAL_SIGNS_RANGES.heartRate;
    if (value < vital.ranges.normal.min) {
      return { status: "low", message: vital.ranges.low.label };
    } else if (value >= vital.ranges.normal.min && value <= vital.ranges.normal.max) {
      return { status: "normal", message: vital.ranges.normal.label };
    } else {
      return { status: "high", message: vital.ranges.high.label };
    }
  } else if (type === "temperature") {
    const vital = VITAL_SIGNS_RANGES.temperature;
    if (value < vital.ranges.normal.min) {
      return { status: "low", message: vital.ranges.low.label };
    } else if (value >= vital.ranges.normal.min && value <= vital.ranges.normal.max) {
      return { status: "normal", message: vital.ranges.normal.label };
    } else if (value >= vital.ranges.fever.min && value < vital.ranges.fever.max) {
      return { status: "high", message: vital.ranges.fever.label };
    } else {
      return { status: "critical", message: vital.ranges.high.label };
    }
  } else if (type === "respiratoryRate") {
    const vital = VITAL_SIGNS_RANGES.respiratoryRate;
    if (value < vital.normal.min) {
      return { status: "low", message: "Below normal range" };
    } else if (value >= vital.normal.min && value <= vital.normal.max) {
      return { status: "normal", message: "Within normal range" };
    } else {
      return { status: "high", message: "Above normal range" };
    }
  }
  
  return { status: "normal", message: "Check specific parameters" };
};

/**
 * Get specialty by value
 */
export const getSpecialtyInfo = (value: string) => {
  return MEDICAL_SPECIALTIES.find((s) => s.value === value);
};

/**
 * Calculate BMI
 */
export const calculateBMI = (weightKg: number, heightM: number): number => {
  return weightKg / (heightM * heightM);
};

/**
 * Interpret BMI
 */
export const interpretBMI = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};
