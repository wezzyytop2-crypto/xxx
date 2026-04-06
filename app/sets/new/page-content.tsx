'use client';

import dynamic from "next/dynamic";
import { BulkImportCSV } from "@/features/shared/bulk-import-csv";
import { LoadingSpinner } from "@/components/loading-spinner";

// Lazy load editor screen to reduce initial bundle size
const SetEditorScreen = dynamic(
  () => import("@/components/screens/set-editor-screen").then(mod => ({ default: mod.SetEditorScreen })),
  { loading: () => <LoadingSpinner /> }
);

export function NewSetPageContent() {
  return (
    <>
      <div className="screen-pad mt-6 mb-4">
        <BulkImportCSV />
      </div>
      <SetEditorScreen mode="create" />
    </>
  );
}
