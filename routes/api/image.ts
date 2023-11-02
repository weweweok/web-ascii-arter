import { HandlerContext } from "$fresh/server.ts";

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const image = _req.body;
  console.log(image);
  /*アスキーアートの起動*/
  //   return new Response(image);
  return new Response("image api method is called");
};
