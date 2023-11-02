import { useSignal } from "https://esm.sh/*@preact/signals@1.2.1";
export default function ImageForm() {
  const buttonActiveDisable = useSignal(false);
  const uploadImage = (event: Event) => {
    buttonActiveDisable.value = true;
    console.log("yattenaize !!");
    const fileData = new FileReader();
    fileData.onload = function () {
      const preview = document.getElementById("preview") as HTMLImageElement;
      preview.src = fileData.result as string;
    };
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement);
    if (inputElement.files) {
      fileData.readAsDataURL(inputElement.files[0]);
    }
  };
  return (
    <form action="post">
      <input
        type="file"
        disabled={buttonActiveDisable.value}
        accept="image/*"
        id="upload-form"
        class="px-44"
        onChange={(event) => uploadImage(event)}
      />
      <button type="submit">ファイルをアップロードする</button>
    </form>
  );
}
