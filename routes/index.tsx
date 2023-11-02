import { useSignal } from "@preact/signals";
import ImageForm from "../islands/ImageForm.tsx";
import Top from "../islands/Top.tsx";
import Subtitle from "../islands/subTitle.tsx";
export default function Home() {
  return (
    <div>
      <body>
        <Top />
        <Subtitle />
        <ImageForm />
      </body>
    </div>
  );
}
