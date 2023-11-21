from pathlib import Path
from PIL import Image, ImageSequence
import os


# 現在の状況を標準出力に表示するかどうか
DEBUG_MODE = True


def extract_png(
    image_path: str, destination: str = os.getcwd() + "/python" + "/splitted"
):
    frames = get_frames(image_path)
    write_frames(frames, image_path, destination)


def get_frames(path):
    """パスで指定されたファイルのフレーム一覧を取得する"""
    im = Image.open(path)
    return (frame.copy() for frame in ImageSequence.Iterator(im))


def write_frames(frames, name_original, destination):
    """フレームを別個の画像ファイルとして保存する"""
    path = Path(name_original)

    stem = path.stem
    extension = ".png"

    # 出力先のディレクトリが存在しなければ作成しておく
    dir_dest = Path(destination)
    if not dir_dest.is_dir():
        dir_dest.mkdir(0o700)
        if DEBUG_MODE:
            print('Destionation directory is created: "{}".'.format(destination))

    for i, f in enumerate(frames):
        name = "{}/{}-{:02}{}".format(destination, stem, i + 1, extension)
        f.save(name)
        if DEBUG_MODE:
            print('A frame is saved as "{}".'.format(name))


if __name__ == "__main__":
    main("ずんだもん.GIF")
