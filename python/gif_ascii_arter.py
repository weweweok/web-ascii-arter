from PIL import Image, ImageDraw, ImageFont
import numpy as np
from extract_png import extract_png
import os.path
import os
import glob
import pathlib
import pprint
import shutil
import sys
import base64
import cv2

FONT_SIZE = 10
GRID_SIZE = (1, 1)
FONT_COLOR_SET = ("#ffffff", "#000000")
FONT_PATH = "./font/UbuntuMono-B.ttf"

FONT_COLOR, FONT_BACKGROUND_COLOR = FONT_COLOR_SET
COLUMNS, ROWS = GRID_SIZE

ABSOLUTE_PATH = os.getcwd() + "/python"


def convert_to_png(gif_name: str):
    extract_png(gif_name)
    IMAGE_NAMES = glob.glob(ABSOLUTE_PATH + "/splitted/*.png")

    return sorted(IMAGE_NAMES)


def image2ascii(input_image):
    original_width = int(input_image.size[0])
    original_height = int(input_image.size[1])

    width = original_width * COLUMNS
    height = original_height * ROWS

    character, line = "", []
    font = ImageFont.truetype(FONT_PATH, FONT_SIZE, encoding="utf-8")
    input_pix = input_image.load()
    output_image = Image.new("RGBA", (width, height), FONT_BACKGROUND_COLOR)
    draw = ImageDraw.Draw(output_image)

    font_width = int(font.getlength("#"))
    font_height = int(FONT_SIZE)

    margin_width = width % font_width
    margin_height = height % font_height

    offset_x = int(round(margin_width / 2))
    offset_y = int(round(margin_height / 2))

    for row in range(ROWS):
        for y in range(offset_y, int(original_height) - offset_y, font_height):
            line = []
            for column in range(COLUMNS):
                for x in range(offset_x, int(original_width) - offset_x, font_width):
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
                fill=FONT_COLOR,
            )
    return output_image


def make_ascii_gif():
    files = sorted(glob.glob(ABSOLUTE_PATH + "/ascii_arts/*.png"))

    images = list(map(lambda file: Image.open(file), files))
    images[0].save(
        ABSOLUTE_PATH + "/anime.gif",
        save_all=True,
        append_images=images[1:],
        optimize=False,
        duration=100,
        loop=0,
    )


def delete_folder():
    shutil.rmtree(ABSOLUTE_PATH + "/splitted")
    shutil.rmtree(ABSOLUTE_PATH + "/ascii_arts")


def announce():
    return sys.stdout.write("converting gif is successed!!")


if __name__ == "__main__":
    image_names = convert_to_png(ABSOLUTE_PATH + "/posted-image.gif")
    directory_name = os.path.dirname(image_names[0])
    sys.stdout.write(directory_name)
    if directory_name != "":
        directory_name = directory_name + "/"
    ascii_image_directory = ABSOLUTE_PATH + "/ascii_arts"

    for image_name in image_names:
        print("Input image: {0}".format(image_name))

        with Image.open(image_name) as input_image:
            output_image = image2ascii(input_image)

            file_name, extension = os.path.splitext(os.path.basename(image_name))

            ascii_image_name = "{0}/ascii_{1}_{2}x{3}_{4}{5}".format(
                ascii_image_directory, FONT_SIZE, ROWS, COLUMNS, file_name, extension
            )

            ascii_image_directory = os.path.dirname(ascii_image_name)
            if not os.path.exists(ascii_image_directory):
                os.makedirs(ascii_image_directory)

            output_image.save(ascii_image_name)

            print("Output image: {0}".format(ascii_image_name))

    make_ascii_gif()
    delete_folder()
    announce()
