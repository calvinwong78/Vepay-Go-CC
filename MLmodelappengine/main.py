from operator import mod
from flask import Flask, jsonify
from flask import request
import numpy as np
from character_segmentation import detect_chars, predict_characters, prepare_model

app = Flask(__name__)

@app.route('/test')
def hello_world():
   return 'Hello calvin'


@app.route("/character-segmentation", methods=['POST'])
def character_segmentation():
    data=request.get_json()
    print("masuk data =\n", data["license-plate"])
    np_data = np.array(data["license-plate"])
    print(np_data.shape)
    model = prepare_model()
    data_for_prediction = detect_chars(imag=np_data)
    characters = predict_characters(model=model, data=data_for_prediction)
    print(characters)
    return jsonify(
        prediction=characters
    ), 200

if __name__ == "__main__":
    app.run(debug=True);
