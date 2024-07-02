import {
  cleanup,
  fireEvent,
  render,
  setup,
} from "$fresh-testing-library/components.ts";
import { expect } from "$fresh-testing-library/expect.ts";
import { beforeAll, beforeEach, describe, it } from "$std/testing/bdd.ts";
import ImageForm from "../islands/ImageForm.tsx";

describe("画像アップロード処理", () => {
  beforeAll(setup);
  beforeEach(cleanup);
  it("jpg,png,gifファイルをアップロードできるようにする", async () => {
    const screen = await render(<ImageForm />);
    const fileUpload = await screen.getByLabelText(
      "ファイルを選択",
    );
    await expect(fileUpload).toBeInTheDocument();
    // Create a mock file for testing
    const jpgFile = new File([""], "test.jpg", { type: "image/jpeg" });
    const pngFile = new File([""], "test.png", { type: "image/png" });
    const gifFile = new File([""], "test.gif", { type: "image/gif" });
    // Test jpg
    await fireEvent.change(fileUpload, jpgFile);
    await expect(fileUpload).toBeDisabled();
    cleanup();
    // Test png
    await fireEvent.change(fileUpload, pngFile);
    await expect(fileUpload).toBeDisabled();
    cleanup();
    // Test gif
    await fireEvent.change(fileUpload, gifFile);
    await expect(fileUpload).toBeDisabled();
  });
});
