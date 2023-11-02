import { HttpCache } from "https://deno.land/x/deno_cache@0.4.1/http_cache.ts";
import { useSignal } from "https://esm.sh/*@preact/signals@1.2.1";

export default function ImageForm() {
  const buttonActiveDisable = useSignal(false);

  const uploadImage = function (event: Event) {
    buttonActiveDisable.value = true;
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

  const upLoadToServer = function (e: Event) {
    e.preventDefault();
    const imageElement = document.getElementById("preview") as HTMLImageElement;
    const image = imageElement.src;
    const url = window.location;

    console.log(url);
    fetch(url + "api/image", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(image),
    }).then((data) => {
      console.log(data.text);
    });
  };
  return (
    <div class="top-0 left-1/2 translate-x-1/4">
      <form action="post">
        <input
          type="file"
          disabled={buttonActiveDisable.value}
          accept="image/*"
          id="upload-form"
          class="border-8 border-white"
          onChange={(event) => uploadImage(event)}
        />
        <button
          type="submit"
          onClick={(e) => upLoadToServer(e)}
          class="border-1 rounded-md border-blue-300 bg-blue-300"
        >
          ファイルをアップロードする
        </button>
      </form>
      <img id="preview" />
    </div>
  );
}
