import { SetEditorScreen } from "@/components/screens/set-editor-screen";

export const metadata = {
  title: "Редактирование набора"
};

export default function EditSetPage({
  params
}: {
  params: {
    setId: string;
  };
}) {
  return <SetEditorScreen mode="edit" setId={params.setId} />;
}
