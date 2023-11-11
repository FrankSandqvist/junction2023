import demucs.separate
import torch 
import glob
from tqdm import tqdm

def main():
    print(f"CUDA is available: {torch.cuda.is_available()}")
    for audio_file in tqdm(glob.glob('original_audios/*.mp3')):
        demucs.separate.main(["--mp3", audio_file])

if __name__ == "__main__":
    main()


