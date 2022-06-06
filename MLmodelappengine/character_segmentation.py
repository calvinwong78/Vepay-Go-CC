import cv2
import numpy as np
import functools
from pathlib import Path
import os
import shutil
import tensorflow as tf


def detect_chars(imag, img_name='', showSteps=False):
    # image = cv2.imread(imag)
    # vis0 = cv2.fromarray(imag)
    # img = cv2.imdecode(imag, flags=cv2.IMREAD_COLOR)
    image = np.array(imag, np.uint8)
    image = cv2.resize(image, (300, 120))
    # image = cv2.resize(imag, (120, 300))
    # g = cv2.cv.fromarray(imag)
    # g = np.asarray(g)
    # image = cv2.resize(g,(300,120) )
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = 255-gray
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(blurred, 255,
                                   cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 43, 9)
    thresh = cv2.erode(thresh, (3, 3))
    thresh = cv2.dilate(thresh, (3, 3))
    thresh = cv2.dilate(thresh, (3, 3))
    thresh = cv2.erode(thresh, (3, 3))

    _, labels = cv2.connectedComponents(thresh)

    mask = np.zeros(thresh.shape, dtype="uint8")

    # Set lower bound and upper bound criteria for characters
    total_pixels = image.shape[0] * image.shape[1]
    lower = total_pixels // 300  # heuristic param, can be fine tuned if necessary
    upper = total_pixels // 2  # heuristic param, can be fine tuned if necessary
    # Loop over the unique components
    for (i, label) in enumerate(np.unique(labels)):
        # If this is the background label, ignore it
        if label == 0:
            continue

        # Otherwise, construct the label mask to display only connected component
        # for the current label
        labelMask = np.zeros(thresh.shape, dtype="uint8")
        labelMask[labels == label] = 255
        numPixels = cv2.countNonZero(labelMask)

        # If the number of pixels in the component is between lower bound and upper bound,
        # add it to our mask
        if numPixels > lower and numPixels < upper:
            mask = cv2.add(mask, labelMask)
    if showSteps == True:
        cv2.imshow("thresh", thresh)
        cv2.imshow("gray", gray)
        cv2.imshow("mask", mask)

    # Find contours and get bounding box for each contour
    cnts, _ = cv2.findContours(
        mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    boundingBoxes = [cv2.boundingRect(c) for c in cnts]

    # # Sort the bounding boxes from left to right, top to bottom
    # # sort by Y first, and then sort by X if Ys are similar
    def compare(rect1, rect2):
        if abs(rect1[1] - rect2[1]) > 10:
            return rect1[1] - rect2[1]
        else:
            return rect1[0] - rect2[0]

    boundingBoxes = sorted(boundingBoxes, key=functools.cmp_to_key(compare))
    detected_char_list = []
    new_mask = mask.copy()
    for c in boundingBoxes:
        x, y, w, h = c
        x = x-2
        y = y-2
        w = w+2
        h = h+2
        if w > 5 and h > 10 and x > 2 and x < 280 and y > 10 and y < 60:
            cv2.rectangle(new_mask, (x, y), (x+w, y+h), (0, 0, 0), 3)
            char = np.array(mask[y:y+h, x:x+w], np.uint8)
            char = cv2.resize(char, (100, 75))
            print(np.shape(char))
            detected_char_list.append(char)
            # detected_char_list.append(mask[y:y+h, x:x+w])
    # cv2.imshow("detected_char",new_mask)
    # output(detected_char_list, img_name)  # Take all detected_chars into a folder
    return detected_char_list
    # return


def output(detected_char_list, img_name):
    i = 1
    # Directory of current working directory, not __file__
    path = os.path.join(Path().absolute(), "detected_chars")
    path = os.path.join(path, img_name[:-3])
    if not os.path.exists(path):
        os.makedirs(path)

    for pic in detected_char_list:
        cv2.resize(pic, (70, 100))
        print(pic)
        pic_format = "test"+str(i)+".jpg"
        cv2.imwrite(os.path.join(path, pic_format), pic)
        i += 1


def prepare_model():
    imported_model = tf.keras.models.load_model('./binary_model_new_data.h5')
    return imported_model


def predict_characters(model, data):
    characters = ''
    # for char_file in os.listdir("detected_chars"):
    #     img = cv2.imread("detected_chars/"+char_file)
    #     # image_norm = cv2.normalize(img, None, alpha=0,beta=1, norm_type=cv2.NORM_MINMAX)
    #     x = tf.convert_to_tensor(img)
    #     x = tf.expand_dims(x, axis=0)

    #     classes = model.predict(x)
    #     result = int(np.argmax(classes))
    #     dictionary = {0:'0', 1:'1', 2 :'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 10:'A',
    #         11:'B', 12:'C', 13:'D', 14:'E', 15:'F', 16:'G', 17:'H', 18:'I', 19:'J', 20:'K',
    #         21:'L', 22:'M', 23:'N', 24:'O', 25:'P', 26:'Q', 27:'R', 28:'S', 29:'T',
    #         30:'U', 31:'V', 32:'W', 33:'X', 34:'Y', 35:'Z'}
    #     print(dictionary[result])
    #     characters += dictionary[result]
    dictionary = {0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'A',
                  11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F', 16: 'G', 17: 'H', 18: 'I', 19: 'J', 20: 'K',
                  21: 'L', 22: 'M', 23: 'N', 24: 'O', 25: 'P', 26: 'Q', 27: 'R', 28: 'S', 29: 'T',
                  30: 'U', 31: 'V', 32: 'W', 33: 'X', 34: 'Y', 35: 'Z'}
    for arr in data:
        # img = cv2.imread("detected_chars/"+char_file)
        # image_norm = cv2.normalize(img, None, alpha=0,beta=1, norm_type=cv2.NORM_MINMAX)
        x = tf.convert_to_tensor(arr)
        x = tf.expand_dims(x, axis=0)

        classes = model.predict(x)
        result = int(np.argmax(classes))
        print(dictionary[result])
        characters += dictionary[result]
    # Delete Folder Directory
    # if os.path.exists(os.path.join(os.getcwd(), "detected_chars")):
    #     shutil.rmtree(os.path.join(os.getcwd(), "detected_chars"))

    return characters
