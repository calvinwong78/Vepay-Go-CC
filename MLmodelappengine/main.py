from flask import Flask, jsonify
from flask import request
import numpy as np
from character_segmentation import detect_chars, predict_characters, prepare_model

app = Flask(__name__)

@app.route("/", methods=['POST'])
def index():
    data=request.get_json()
    # get the image which is in pixels
    np_data = np.array(data["license-plate"])
    model = prepare_model(model_path='./model.h5')
    data_for_prediction = detect_chars(img=np_data)
    characters = predict_characters(model=model, data=data_for_prediction)
    print(characters)
    return jsonify(
        prediction=characters
    ), 200

if __name__ == "__main__":
    app.run(debug=True);
