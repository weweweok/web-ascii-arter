import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
const UploadError = (
  { errorDialogOpen }: { errorDialogOpen: Signal<boolean> },
) => {
  return (
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-5 rounded text-center">
        <h2 class="text-lg font-bold">エラー</h2>
        <p class="mt-2">
          JPG, PNG, GIF形式のファイルのみアップロード可能です。
        </p>
        <button
          onClick={() => {
            errorDialogOpen.value = false;
          }}
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default UploadError;
