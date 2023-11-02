import { useSignal } from "@preact/signals";
import ImageForm from "../islands/ImageForm.tsx";

export default function Home() {
  return (
    <div>
      <div class="relative bg-teal-300 ">
        <h1 class="text-center text-6xl ">
          WEB ASCII ARTER
        </h1>
      </div>
      <div class="relative">
        <h2 class="text-center text-3xl py-14">
          画像とGIF画像をアスキーアートに変換できるサイトです。
        </h2>

        <ImageForm />

        <img id="preview" />
      </div>
    </div>
  );
}
