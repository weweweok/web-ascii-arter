import { Signal, useSignal } from "https://esm.sh/*@preact/signals@1.2.1";
import UploadError from "./dialogs/UploadError.tsx";

const createAsciiArt = async (image: File) => {
  const formData = new FormData();
  formData.append("files", image);
  console.log(image.arrayBuffer());
  const url = "https://decisive-robenia-wewewe.koyeb.app/files/";
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    mode: "cors",
  });
  return response.blob();
};

const loadImageWhenUploadImage = (
  fileData: FileReader,
  uploadedImage: Signal<string>,
  imagePreviewOpen: Signal<boolean>,
) => (fileData.onload = () => {
  const asciiArtPreview = document.getElementById(
    "ascii-art",
  ) as HTMLImageElement;

  if (asciiArtPreview.src !== "") asciiArtPreview.src = "";
  uploadedImage.value = fileData.result as string;
  imagePreviewOpen.value = true;
});

const loadImageWhencreateAsciiArt = (
  fileData: FileReader,
  blobUrl: string,
  uploadedImage: Signal<string>,
  imagePreviewOpen: Signal<boolean>,
) => (fileData.onload = () => {
  const asciiArtPreview = document.getElementById(
    "ascii-art",
  ) as HTMLImageElement;
  asciiArtPreview.src = blobUrl;
  uploadedImage.value = "";
  imagePreviewOpen.value = false;
});

const downloadAsciiArt = (asciiArtFileType: Signal<string>) => {
  const asciiArtPreview = document.getElementById(
    "ascii-art",
  ) as HTMLImageElement;
  const asciiArt = asciiArtPreview.src;

  const download = document.createElement("a");
  download.href = asciiArt;
  download.download = `ascii-art.${asciiArtFileType.value}`;
  document.body.appendChild(download);
  download.click();
  document.body.removeChild(download);
};

export default function ImageForm() {
  const isActiveFileUpLoderDisable = useSignal(false);
  const buttonDisable = useSignal(false);
  const isAnnounsing = useSignal(false);
  const asciiArtFileType = useSignal("");
  const errorDialogOpen = useSignal(false);
  const uploadedImage = useSignal("");
  const imagePreviewOpen = useSignal(false);

  const uploadImage = (event: Event) => {
    isActiveFileUpLoderDisable.value = true;

    const fileData = new FileReader();
    loadImageWhenUploadImage(fileData, uploadedImage, imagePreviewOpen);

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      if (
        !["image/jpeg", "image/png", "image/gif"].includes(
          inputElement.files[0].type,
        )
      ) {
        errorDialogOpen.value = true;
      } else {
        fileData.readAsDataURL(inputElement.files[0]);
      }
    }
  };

  const upLoadToServer = async (e: Event) => {
    e.preventDefault();
    const imageElement = document.getElementById(
      "upload-form",
    ) as HTMLFormElement;
    const image = imageElement.files[0];
    const fileType = image.type.split("/")[1];
    // fixme: ここでファイルタイプを取得しているが、サーバー側で取得するように修正する
    // APIから取得できるファイルは現状gifのみなので、ここで取得している
    asciiArtFileType.value = fileType === "jpeg" || fileType === "jpg"
      ? "png"
      : fileType;

    buttonDisable.value = true;
    isAnnounsing.value = true;

    const asciiArtBlob = await createAsciiArt(image);
    const blobUrl = await window.URL.createObjectURL(asciiArtBlob);
    const fileData = new FileReader();
    await loadImageWhencreateAsciiArt(
      fileData,
      blobUrl,
      uploadedImage,
      imagePreviewOpen,
    );
    fileData.readAsDataURL(asciiArtBlob);

    isActiveFileUpLoderDisable.value = false;
    buttonDisable.value = false;
    isAnnounsing.value = false;
  };

  return (
    <>
      <div class="content-center items-center self-center translate-x-1/4">
        <form action="post">
          <input
            type="file"
            disabled={isActiveFileUpLoderDisable.value}
            name="file-upload"
            id="upload-form"
            aria-label="ファイルを選択"
            class="border-8 border-white"
            accept={".jpg,.jpeg,.png,.gif"}
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
        {imagePreviewOpen.value && (
          <img
            id="preview"
            name="preview"
            src={uploadedImage.value}
            class="max-w-xs max-h-56 "
          />
        )}
        <img id="ascii-art" src="" class="max-w-xs max-h-56 content-center" />
        <button
          class="border border-black rounded-md border-green-300 bg-green-300"
          onClick={() => {
            downloadAsciiArt(asciiArtFileType);
          }}
        >
          アスキーアートをダウンロード
        </button>
      </div>
      {errorDialogOpen.value && (
        <UploadError errorDialogOpen={errorDialogOpen} />
      )}
    </>
  );
}
