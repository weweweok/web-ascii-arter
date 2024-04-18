import { useSignal } from "https://esm.sh/*@preact/signals@1.2.1";

const createAsciiArt = async (image: File) => {
  const formData = new FormData();
  formData.append("files", image);
  const url = location.hostname === "localhost"
    ? "http://127.0.0.1:8080/files/"
    : "https://create-ascii-art.onrender.com/files/";
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    mode: "cors",
  });
  return response.blob();
};

const loadImageWhenUploadImage = (
  fileData: FileReader,
) => (fileData.onload = () => {
  const asciiArtPreview = document.getElementById(
    "ascii-art",
  ) as HTMLImageElement;
  asciiArtPreview.src = "";
  const preview = document.getElementById("preview") as HTMLImageElement;
  preview.src = fileData.result as string;
});

const loadImageWhencreateAsciiArt = (
  fileData: FileReader,
  blobUrl: string,
) => (fileData.onload = () => {
  const asciiArtPreview = document.getElementById(
    "ascii-art",
  ) as HTMLImageElement;
  asciiArtPreview.src = blobUrl;
  const preview = document.getElementById("preview") as HTMLImageElement;
  preview.src = "";
});

export default function ImageForm() {
  const isActiveFileUpLoderDisable = useSignal(false);
  const buttonDisable = useSignal(false);
  const isAnnounsing = useSignal(false);
  const asciiArtFileType = useSignal("");

  const uploadImage = (event: Event) => {
    isActiveFileUpLoderDisable.value = true;

    const fileData = new FileReader();
    loadImageWhenUploadImage(fileData);

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      fileData.readAsDataURL(inputElement.files[0]);
    }
  };

  const upLoadToServer = async (e: Event) => {
    e.preventDefault();
    const imageElement = document.getElementById(
      "upload-form",
    ) as HTMLFormElement;
    const image = imageElement.files[0];

    buttonDisable.value = true;
    isAnnounsing.value = true;

    const asciiArtBlob = await createAsciiArt(image);
    const blobUrl = await window.URL.createObjectURL(asciiArtBlob);
    const fileData = new FileReader();
    loadImageWhencreateAsciiArt(fileData, blobUrl);
    asciiArtFileType.value = asciiArtBlob.type;
    fileData.readAsDataURL(asciiArtBlob);

    isActiveFileUpLoderDisable.value = false;
    buttonDisable.value = false;
    isAnnounsing.value = false;
  };

  const downloadAsciiArt = () => {
    const asciiArtPreview = document.getElementById(
      "ascii-art",
    ) as HTMLImageElement;
    const asciiArt = asciiArtPreview.src;

    const download = document.createElement("a");
    download.href = asciiArt;
    download.download = `ascii-art.${asciiArtFileType.value.split("/")[1]}`;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
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
          disabled={buttonDisable.value}
          onClick={(e) => upLoadToServer(e)}
          class="border-1 rounded-md border-blue-300 bg-blue-300"
        >
          ファイルをアップロードする
        </button>
      </form>
      {isAnnounsing.value
        ? (
          <div id="announce-generating">
            <h1>アスキーアートを生成中...</h1>
          </div>
        )
        : undefined}
      <img id="preview" class="max-w-xs max-h-56 " />
      <img id="ascii-art" src="" class="max-w-xs max-h-56 content-center" />
      <button
        onClick={() => {
          downloadAsciiArt();
        }}
      >
        アスキーアートをダウンロード
      </button>
    </div>
  );
}
