import { useSignal } from "https://esm.sh/*@preact/signals@1.2.1";
import { encode } from "https://deno.land/std@0.193.0/encoding/hex.ts";
import { decode } from "$std/encoding/base64.ts";

export default function ImageForm() {
  const isActiveFileUpLoderDisable = useSignal(false);
  const isbuttonActiveDisable = useSignal(false);
  const isAsciiArtpreviewHide = useSignal(true);
  const isPreviewHide = useSignal(false);
  const isAnnounsing = useSignal(false);

  const uploadImage = function (event: Event) {
    if (!isAsciiArtpreviewHide.value) isActiveFileUpLoderDisable.value = true;
    const fileData = new FileReader();
    fileData.onload = function () {
      const preview = document.getElementById("preview") as HTMLImageElement;
      preview.src = fileData.result as string;
    };
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      fileData.readAsDataURL(inputElement.files[0]);
    }
  };

  const upLoadToServer = async function (e: Event) {
    e.preventDefault();
    const imageElement = document.getElementById("preview") as HTMLImageElement;
    const image = imageElement.src;
    const url = window.location;
    isActiveFileUpLoderDisable.value = true;
    isbuttonActiveDisable.value = true;
    isPreviewHide.value = true;
    isAnnounsing.value = true;

    const response = await fetch(url + "api/image", {
      method: "POST",
      body: image,
    });
    isAsciiArtpreviewHide.value = false;
    if (!response.ok) console.error(response.status);
    const asciiArt = await response.text();

    const asciiArtPreview = await document.getElementById(
      "ascii-art",
    ) as HTMLImageElement;
    asciiArtPreview.src = "data:image/png;base64," + asciiArt;

    isActiveFileUpLoderDisable.value = false;
    isbuttonActiveDisable.value = false;
    isPreviewHide.value = false;
    isAnnounsing.value = false;
  };
  return (
    <div class="content-center items-center self-center translate-x-1/4">
      <form action="post">
        <input
          type="file"
          disabled={isActiveFileUpLoderDisable.value}
          accept="image/*"
          id="upload-form"
          class="border-8 border-white"
          onChange={(event) => uploadImage(event)}
        />
        <button
          type="submit"
          disabled={isbuttonActiveDisable.value}
          onClick={(e) => upLoadToServer(e)}
          class="border-1 rounded-md border-blue-300 bg-blue-300"
        >
          ファイルをアップロードする
        </button>
      </form>
      {!isPreviewHide.value
        ? (
          <img
            id="preview"
            class="max-w-xs max-h-56 "
          />
        )
        : undefined}
      {isAnnounsing.value
        ? (
          <div id="announce-generating">
            <h1>アスキーアートを生成中...</h1>
          </div>
        )
        : undefined}

      {isAsciiArtpreviewHide.value ? undefined : (
        <img
          id="ascii-art"
          class="max-w-xs max-h-56 content-center"
        />
      )}
    </div>
  );
}
