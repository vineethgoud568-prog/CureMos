-- Create enums for consultations
CREATE TYPE consultation_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE consultation_type AS ENUM ('text', 'voice', 'video');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'emergency');
CREATE TYPE message_type AS ENUM ('text', 'file', 'system');
CREATE TYPE referral_status AS ENUM ('pending', 'accepted', 'rejected', 'admitted', 'completed');

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  medical_history TEXT,
  current_medications TEXT,
  allergies TEXT,
  blood_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_b_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  status consultation_status NOT NULL DEFAULT 'pending',
  consultation_type consultation_type NOT NULL DEFAULT 'text',
  urgency_level urgency_level NOT NULL DEFAULT 'medium',
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type NOT NULL DEFAULT 'text',
  file_url TEXT,
  file_name TEXT,
  read_status BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status referral_status NOT NULL DEFAULT 'pending',
  admission_date TIMESTAMPTZ,
  notes TEXT,
  diagnosis TEXT,
  recommended_treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients table
CREATE POLICY "Doctor A can view their own patients"
  ON public.patients FOR SELECT
  USING (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor A can insert their own patients"
  ON public.patients FOR INSERT
  WITH CHECK (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor A can update their own patients"
  ON public.patients FOR UPDATE
  USING (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor A can delete their own patients"
  ON public.patients FOR DELETE
  USING (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor B can view referred patients"
  ON public.patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.referrals
      WHERE referrals.patient_id = patients.id
        AND referrals.doctor_b_id = auth.uid()
    )
  );

-- RLS Policies for consultations table
CREATE POLICY "Doctor A can view their consultations"
  ON public.consultations FOR SELECT
  USING (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor B can view their consultations"
  ON public.consultations FOR SELECT
  USING (auth.uid() = doctor_b_id);

CREATE POLICY "Doctor A can create consultations"
  ON public.consultations FOR INSERT
  WITH CHECK (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor A can update their consultations"
  ON public.consultations FOR UPDATE
  USING (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor B can update their consultations"
  ON public.consultations FOR UPDATE
  USING (auth.uid() = doctor_b_id);

-- RLS Policies for messages table
CREATE POLICY "Participants can view consultation messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations
      WHERE consultations.id = messages.consultation_id
        AND (consultations.doctor_a_id = auth.uid() OR consultations.doctor_b_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.consultations
      WHERE consultations.id = messages.consultation_id
        AND (consultations.doctor_a_id = auth.uid() OR consultations.doctor_b_id = auth.uid())
    )
  );

CREATE POLICY "Participants can update message read status"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations
      WHERE consultations.id = messages.consultation_id
        AND (consultations.doctor_a_id = auth.uid() OR consultations.doctor_b_id = auth.uid())
    )
  );

-- RLS Policies for referrals table
CREATE POLICY "Doctor A can view their referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor B can view referrals assigned to them"
  ON public.referrals FOR SELECT
  USING (auth.uid() = doctor_b_id);

CREATE POLICY "Doctor A can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor A can update their referrals"
  ON public.referrals FOR UPDATE
  USING (auth.uid() = doctor_a_id);

CREATE POLICY "Doctor B can update referrals assigned to them"
  ON public.referrals FOR UPDATE
  USING (auth.uid() = doctor_b_id);

-- Create indexes for better query performance
CREATE INDEX idx_patients_doctor_a ON public.patients(doctor_a_id);
CREATE INDEX idx_consultations_doctor_a ON public.consultations(doctor_a_id);
CREATE INDEX idx_consultations_doctor_b ON public.consultations(doctor_b_id);
CREATE INDEX idx_consultations_status ON public.consultations(status);
CREATE INDEX idx_messages_consultation ON public.messages(consultation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_referrals_doctor_a ON public.referrals(doctor_a_id);
CREATE INDEX idx_referrals_doctor_b ON public.referrals(doctor_b_id);
CREATE INDEX idx_referrals_patient ON public.referrals(patient_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);

-- Add updated_at triggers
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable real-time for all tables
ALTER TABLE public.patients REPLICA IDENTITY FULL;
ALTER TABLE public.consultations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.referrals REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;

-- Create storage buckets for avatars and medical documents
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('medical_documents', 'medical_documents', false);

-- Storage RLS policies for avatars (public bucket)
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage RLS policies for medical documents (private bucket)
CREATE POLICY "Doctors can view their own medical documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'medical_documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Doctors can upload medical documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'medical_documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Doctors can update their medical documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'medical_documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Doctors can delete their medical documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'medical_documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );