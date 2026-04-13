import { StudyScreen } from "@/components/screens/study-screen";
import { isStudyMode } from "@/lib/study";

export default function StudyPage({
  params,
  searchParams
}: {
  params: {
    setId: string;
  };
  searchParams: {
    mode?: string;
  };
}) {
  const mode = isStudyMode(searchParams.mode) ? searchParams.mode : "focus";

  return <StudyScreen setId={params.setId} initialMode={mode} />;
}
