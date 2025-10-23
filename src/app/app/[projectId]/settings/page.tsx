import { redirect } from 'next/navigation';

export default function SettingsPage({ params }: { params: { projectId: string } }) {
  redirect(`/app/${params.projectId}/settings/general`);
}
