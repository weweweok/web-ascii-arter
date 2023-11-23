import { encode } from "$std/encoding/base64.ts";
import { python } from "https://deno.land/x/python@0.4.2/mod.ts";
const createAsciiArtFile = `
from PIL import Image, ImageDraw, ImageFont
import os.path
import os
import glob
import pprint
import shutil
import sys

from pathlib import Path
from PIL import Image, ImageSequence


class ExtractPng:
    __DEBUG_MODE = True

    def extract_png(
        self, image_path: str, destination: str = os.getcwd() + "/splitted"
    ):
        frames = self.__get_frames(image_path)
        self.__write_frames(frames, image_path, destination)

    def __get_frames(self, path):
        """パスで指定されたファイルのフレーム一覧を取得する"""
        im = Image.open(path)
        return (frame.copy() for frame in ImageSequence.Iterator(im))

    def __write_frames(self, frames, name_original, destination):
        """フレームを別個の画像ファイルとして保存する"""
        path = Path(name_original)

        stem = path.stem
        extension = ".png"

        # 出力先のディレクトリが存在しなければ作成しておく
        dir_dest = Path(destination)
        if not dir_dest.is_dir():
            dir_dest.mkdir(0o700)
            if self.__DEBUG_MODE:
                print('Destionation directory is created: "{}".'.format(destination))

        for i, f in enumerate(frames):
            name = "{}/{}-{:02}{}".format(destination, stem, i + 1, extension)
            f.save(name)
            if self.__DEBUG_MODE:
                print('A frame is saved as "{}".'.format(name))


class CreateAsciiArt:
    def __init__(
        self,
        FONT_SIZE=10,
        GRID_SIZE=(1, 1),
        FONT_COLOR_SET=("#ffffff", "#000000"),
        ABSOLUTE_PATH=os.getcwd(),
    ) -> None:
        self.__FONT_SIZE = FONT_SIZE
        self.__FONT_PATH = "./font/UbuntuMono-B.ttf"

        self.__FONT_COLOR, self.__FONT_BACKGROUND_COLOR = FONT_COLOR_SET
        self.__COLUMNS, self.__ROWS = GRID_SIZE

        self.__ABSOLUTE_PATH = ABSOLUTE_PATH

    def __convert_to_png(self, gif_name: str):
        ExtractPng().extract_png(gif_name)
        image_names = glob.glob(self.__ABSOLUTE_PATH + "/splitted/*.png")

        return sorted(image_names)

    def __image2ascii(self, input_image):
        original_width = int(input_image.size[0])
        original_height = int(input_image.size[1])

        width = original_width * self.__COLUMNS
        height = original_height * self.__ROWS

        character, line = "", []
        font = ImageFont.truetype(self.__FONT_PATH, self.__FONT_SIZE, encoding="utf-8")
        input_pix = input_image.load()
        output_image = Image.new("RGBA", (width, height), self.__FONT_BACKGROUND_COLOR)
        draw = ImageDraw.Draw(output_image)

        font_width = int(font.getlength("#"))
        font_height = int(self.__FONT_SIZE)

        margin_width = width % font_width
        margin_height = height % font_height

        offset_x = int(round(margin_width / 2))
        offset_y = int(round(margin_height / 2))

        for row in range(self.__ROWS):
            for y in range(offset_y, int(original_height) - offset_y, font_height):
                line = []
                for column in range(self.__COLUMNS):
                    for x in range(
                        offset_x, int(original_width) - offset_x, font_width
                    ):
                        pixel = input_pix[x - offset_x, y - offset_y]
                        # ピクセルが整数（つまり、グレースケール）の場合
                        if isinstance(pixel, int):
                            gray = pixel
                        # ピクセルがタプル（つまり、カラー）の場合
                        else:
                            r, g, b, _ = pixel
                            gray = r * 0.2126 + g * 0.7152 + b * 0.0722
                        "polikeiji"
                        if gray > 130:
                            character = " "
                        elif gray > 100:
                            character = "i"
                        elif gray > 90:
                            character = "l"
                        elif gray > 80:
                            character = "j"
                        elif gray > 60:
                            character = "o"
                        elif gray > 50:
                            character = "e"
                        elif gray > 40:
                            character = "p"
                        elif gray > 30:
                            character = "k"
                        else:
                            character = "#"
                        line.append(character)
                draw.text(
                    (offset_x, y + row * original_height),
                    "".join(line),
                    font=font,
                    fill=self.__FONT_COLOR,
                )
        return output_image

    def __make_ascii_gif(self):
        files = sorted(glob.glob(self.__ABSOLUTE_PATH + "/ascii_arts/*.png"))

        images = list(map(lambda file: Image.open(file), files))
        images[0].save(
            self.__ABSOLUTE_PATH + "/anime.gif",
            save_all=True,
            append_images=images[1:],
            optimize=False,
            duration=100,
            loop=0,
        )

    def __delete_folder(self):
        shutil.rmtree(self.__ABSOLUTE_PATH + "/splitted")
        shutil.rmtree(self.__ABSOLUTE_PATH + "/ascii_arts")

    def __announce(self):
        return sys.stdout.write("converting gif is successed!!")

    def create_ascii_art(self):
        image_names = self.__convert_to_png(self.__ABSOLUTE_PATH + "/posted-image.gif")
        directory_name = os.path.dirname(image_names[0])
        sys.stdout.write(directory_name)
        if directory_name != "":
            directory_name = directory_name + "/"
        ascii_image_directory = self.__ABSOLUTE_PATH + "/ascii_arts"

        for image_name in image_names:
            print("Input image: {0}".format(image_name))

            with Image.open(image_name) as input_image:
                output_image = self.__image2ascii(input_image)

                file_name, extension = os.path.splitext(os.path.basename(image_name))

                ascii_image_name = "{0}/ascii_{1}_{2}x{3}_{4}{5}".format(
                    ascii_image_directory,
                    self.__FONT_SIZE,
                    self.__ROWS,
                    self.__COLUMNS,
                    file_name,
                    extension,
                )

                ascii_image_directory = os.path.dirname(ascii_image_name)
                if not os.path.exists(ascii_image_directory):
                    os.makedirs(ascii_image_directory)

                output_image.save(ascii_image_name)

                print("Output image: {0}".format(ascii_image_name))

        self.__make_ascii_gif()
        self.__delete_folder()
        self.__announce()


`;

export async function runPython(): Promise<string> {
  const createAsciiArt = await python.runModule(
    createAsciiArtFile,
    "CreateAsciiArt",
  );
  await createAsciiArt.CreateAsciiArt().create_ascii_art();

  const getAsciiArt = await Deno.readFile("./anime.gif");
  return encode(getAsciiArt);
}
