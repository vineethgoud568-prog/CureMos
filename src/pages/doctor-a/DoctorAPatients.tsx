import { MainLayout } from "@/components/layout/MainLayout";

export default function DoctorAPatients() {
  return (
    <MainLayout title="My Patients" userType="doctor-a">
      <div className="container max-w-4xl mx-auto p-4">
        <p className="text-muted-foreground">Patient management will be implemented in Phase 2</p>
      </div>
    </MainLayout>
  );
}
