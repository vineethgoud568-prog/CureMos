import { z } from "zod";

// User profile validation schemas
export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  medical_license: z
    .string()
    .trim()
    .min(5, "Medical license must be at least 5 characters")
    .max(50, "Medical license must be less than 50 characters")
    .optional(),
  specialization: z
    .string()
    .trim()
    .max(100, "Specialization must be less than 100 characters")
    .optional(),
  hospital_affiliation: z
    .string()
    .trim()
    .max(200, "Hospital affiliation must be less than 200 characters")
    .optional(),
});

// Patient registration schema
export const patientSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  gender: z
    .enum(["male", "female", "other"])
    .optional()
    .or(z.literal("")),
  blood_type: z
    .string()
    .trim()
    .regex(/^(A|B|AB|O)[+-]$/, "Invalid blood type format")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .max(500, "Address must be less than 500 characters")
    .optional(),
  medical_history: z
    .string()
    .trim()
    .max(5000, "Medical history must be less than 5000 characters")
    .optional(),
  current_medications: z
    .string()
    .trim()
    .max(2000, "Medications list must be less than 2000 characters")
    .optional(),
  allergies: z
    .string()
    .trim()
    .max(1000, "Allergies list must be less than 1000 characters")
    .optional(),
});

// Consultation message schema
export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(10000, "Message must be less than 10000 characters"),
  message_type: z.enum(["text", "file"]),
  file_url: z.string().url("Invalid file URL").optional(),
  file_name: z
    .string()
    .trim()
    .max(255, "File name must be less than 255 characters")
    .optional(),
});

// Referral schema
export const referralSchema = z.object({
  diagnosis: z
    .string()
    .trim()
    .min(10, "Diagnosis must be at least 10 characters")
    .max(2000, "Diagnosis must be less than 2000 characters"),
  recommended_treatment: z
    .string()
    .trim()
    .max(5000, "Treatment recommendation must be less than 5000 characters")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(5000, "Notes must be less than 5000 characters")
    .optional(),
});

// Authentication schemas
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export const registrationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    full_name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    user_type: z.enum(["doctor_a", "doctor_b"]),
    medical_license: z
      .string()
      .trim()
      .min(5, "Medical license must be at least 5 characters")
      .max(50, "Medical license must be less than 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// File upload validation
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not supported" };
  }

  return { valid: true };
};

// Sanitize HTML content
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
};

// Validate URL for external links
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
