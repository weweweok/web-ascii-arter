import { HandlerContext } from "$fresh/server.ts";
import { decode, encode } from "$std/encoding/base64.ts";

async function runPython() {
  const command = await new Deno.Command("python3", {
    args: ["python/gif_ascii_arter.py"],
  });
  const { code, stdout, stderr } = await command.output();
  if (code === 0) {
    console.info(new TextDecoder().decode(stdout));
  } else {
    console.error(new TextDecoder().decode(stderr));
  }

  // const gif = await Deno.readFile("python/anime.gif");
  // const result = encode(gif);
  // return result;
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
  console.log(imagestring.substring(0, 20));
  const decodeArrayBuffer: Uint8Array = decode(imagestring);

  await Deno.writeFile("python/posted-image.gif", decodeArrayBuffer);
  const output = await runPython();
  return new Response(output);
};
