from pydub import AudioSegment
from tqdm import tqdm
import os

def process_mp3(input_path, output_path, target_duration=90, fade_duration=10):
    audio = AudioSegment.from_file(input_path)

    # Trim to the target duration
    target_duration_ms = target_duration * 1000
    audio = audio[:target_duration_ms]

    # Apply fade-in and fade-out
    fade_in = audio[:fade_duration * 1000].fade_in(fade_duration * 1000)
    fade_out = audio[-fade_duration * 1000:].fade_out(fade_duration * 1000)

    # Concatenate the audio with fades
    audio = fade_in + audio[fade_duration * 1000:-fade_duration * 1000] + fade_out

    # Export the processed audio
    audio.export(output_path, format="mp3")

if __name__ == "__main__":
    main_folder = "separated"
    for root, dirs, files in os.walk(main_folder):
        for file in tqdm(files):
            if file.endswith(".mp3"):
                # Specify the number of seconds to cut from the beginning and end
                target_duration = 90
                fade_duration = 10

                # Specify the duration of the fade-in and fade-out in milliseconds
                #fade_duration = 10000
                input_file = os.path.join(root, file)
                process_mp3(input_file, input_file, target_duration, fade_duration)
