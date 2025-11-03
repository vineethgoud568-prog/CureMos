import { MainLayout } from "@/components/layout/MainLayout";

export default function DoctorAProfile() {
  return (
    <MainLayout title="Profile" userType="doctor-a">
      <div className="container max-w-4xl mx-auto p-4">
        <p className="text-muted-foreground">Profile management will be implemented in Phase 2</p>
      </div>
    </MainLayout>
  );
}
