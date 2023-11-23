import { HandlerContext } from "$fresh/server.ts";
import { decode } from "$std/encoding/base64.ts";
import { runPython } from "../../utility.ts";
export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const imageBuffer: ArrayBuffer = await _req.arrayBuffer();
  const encodeArrayBuffer: string = new TextDecoder().decode(imageBuffer);
  const imagestring = encodeArrayBuffer.replace(
    /^data:image\/[a-z]+;base64,/,
    "",
  );
  const decodeArrayBuffer: Uint8Array = decode(imagestring);

  await Deno.writeFile("./posted-image.gif", decodeArrayBuffer);
  const output = await runPython();
  try {
    await Deno.remove("./posted-image.gif");
    await Deno.remove("./anime.gif");
  } catch (e) {
    return new Response("There are any error", e);
  }

  return new Response(output);
};
