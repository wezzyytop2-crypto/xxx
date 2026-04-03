import { SetDetailScreen } from "@/components/screens/set-detail-screen";

export default function SetPage({
  params
}: {
  params: {
    setId: string;
  };
}) {
  return <SetDetailScreen setId={params.setId} />;
}
