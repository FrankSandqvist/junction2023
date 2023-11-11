from pydub import AudioSegment
import os
from tqdm import tqdm

def reduce_bitrate(input_path, output_path, target_bitrate='128k'):
    audio = AudioSegment.from_file(input_path)
    audio.export(output_path, format="mp3", bitrate=target_bitrate)

def process_folder(main_folder):
    for root, dirs, files in os.walk(main_folder):
        for file in tqdm(files):
            if file.endswith(".mp3"):
                input_path = os.path.join(root, file)
                #output_path = os.path.join(root, f"{os.path.splitext(file)[0]}_reduced.mp3")
                reduce_bitrate(input_path, input_path)
                print(f"Processed: {input_path}")
                #print(f"Output: {output_path}")

if __name__ == "__main__":
    main_folder = "separated"
    process_folder(main_folder)
