from flask import Flask, request, render_template, send_file
from flask_cors import CORS, cross_origin
import glob
import librosa
import json
from pathlib import Path
import os

class song():
    def __init__(self, folder_location):
        json_data = open(folder_location + '/data.json')
        self.json_data = json.load(json_data)
        full_location = os.path.join(folder_location, 
os.path.basename(folder_location))
#        if not 'song_bpm' in self.json_data:
#            tempo = self.count_bpm(os.path.join(folder_location, 
#os.path.basename(folder_location) + '.mp3'))
#            self.json_data['song_bpm'] = tempo
#            with open(folder_location + '/data.json', 'w') as fp:
#                json.dump(self.json_data, fp)
        self.json_data['mp3_links'] = ['/music/'+ folder_location + 
'/vocals.mp3',  '/music/'+ folder_location + '/drums.mp3', '/music/'+ 
folder_location + '/bass.mp3','/music/'+ folder_location + '/other.mp3']


    def count_bpm(self, song_location):
        y, sr = librosa.load(song_location)
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        return tempo

class songDB():
    def __init__(self, location):
        self.l_songs = []
        subfolders = glob.glob(os.path.join(location, '*'))
        print(subfolders)
        for folder in subfolders:
            self.l_songs.append(song(folder).json_data)


app = Flask(__name__)
song_db = songDB('separated')


@app.route('/', methods=['GET'])
@cross_origin()
def helloworld():
    return 'hello'



@app.route('/get_songs', methods=['GET'])
@cross_origin()
def get_songs():
    return song_db.l_songs


@app.route('/music/<path:path>')
@cross_origin()
def music(path):
    return send_file(path,mimetype="audio/mpeg")


if __name__ == '__main__':
    print("Starting server on port 8000")
    app.run(host="0.0.0.0", port=8000)
