import { MainLayout } from "@/components/layout/MainLayout";

export default function DoctorBProfile() {
  return (
    <MainLayout title="Profile" userType="doctor-b">
      <div className="container max-w-4xl mx-auto p-4">
        <p className="text-muted-foreground">Profile management will be implemented in Phase 3</p>
      </div>
    </MainLayout>
  );
}
