import { HandlerContext } from "$fresh/server.ts";
import { decode, encode } from "$std/encoding/base64.ts";

async function runPython(): Promise<string> {
  const command = await new Deno.Command("python3", {
    args: ["python/gif_ascii_arter.py"],
  });
  const { code, stdout, stderr } = await command.output();
  if (code === 0) {
    console.info(new TextDecoder().decode(stdout));
  } else {
    return new TextDecoder().decode(stderr);
  }

  const getAsciiArt = await Deno.readFile("./python/anime.gif");
  return encode(getAsciiArt);
}
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

  await Deno.writeFile("./python/posted-image.gif", decodeArrayBuffer);
  const output = await runPython();
  try {
    await Deno.remove("./python/posted-image.gif");
    await Deno.remove("./python/anime.gif");
  } catch (e) {
    return new Response("There are any error", e);
  }

  return new Response(output);
};
