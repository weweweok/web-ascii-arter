import { useSignal } from "https://esm.sh/*@preact/signals@1.2.1";

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
    const imageElement = document.getElementById(
      "upload-form",
    ) as HTMLFormElement;
    const image = imageElement.files[0];
    isActiveFileUpLoderDisable.value = true;
    isbuttonActiveDisable.value = true;
    isPreviewHide.value = true;
    isAnnounsing.value = true;

    const formData = new FormData();
    formData.append("files", image);
    let url = "http://127.0.0.1:8001/files/";
    if (!window.location.host.includes("localhost")) {
      url = "https://create-ascii-art.onrender.com/files/";
    }
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      mode: "cors",
    });
    const asciiArtBlob = await response.blob();
    const blobUrl = await window.URL.createObjectURL(asciiArtBlob);
    isAsciiArtpreviewHide.value = false;
    const fileData = new FileReader();
    fileData.onload = function () {
      const asciiArtPreview = document.getElementById(
        "ascii-art",
      ) as HTMLImageElement;
      asciiArtPreview.src = blobUrl;
    };
    fileData.readAsDataURL(asciiArtBlob);
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
          enctype="multipart/form-data"
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
          src=""
          class="max-w-xs max-h-56 content-center"
        />
      )}
    </div>
  );
}
