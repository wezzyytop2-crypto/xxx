'use client';

import dynamic from "next/dynamic";
import { BulkImportCSV } from "@/features/shared/bulk-import-csv";
import { ImportSetButton } from "@/components/import-set-button";
import { LoadingSpinner } from "@/components/loading-spinner";

// Lazy load editor screen to reduce initial bundle size
const SetEditorScreen = dynamic(
  () => import("@/components/screens/set-editor-screen").then(mod => ({ default: mod.SetEditorScreen })),
  { loading: () => <LoadingSpinner /> }
);

export function NewSetPageContent() {
  return (
    <>
      <div className="screen-pad mt-6 mb-4 flex flex-col gap-4">
        <BulkImportCSV />
        <ImportSetButton />
      </div>
      <SetEditorScreen mode="create" />
    </>
  );
}
