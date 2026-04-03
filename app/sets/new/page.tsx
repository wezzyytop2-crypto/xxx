import { SetEditorScreen } from "@/components/screens/set-editor-screen";
import { BulkImportCSV } from "@/features/shared/bulk-import-csv";

export const metadata = {
  title: "Новый набор"
};

export default function NewSetPage() {
  return (
    <>
      <div className="screen-pad mt-6 mb-4">
        <BulkImportCSV />
      </div>
      <SetEditorScreen mode="create" />
    </>
  );
}
