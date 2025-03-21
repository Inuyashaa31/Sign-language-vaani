#import dependency
import cv2
import numpy as np
import os
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False                  # Image is no longer writeable
    results = model.process(image)                 # Make prediction
    image.flags.writeable = True                   # Image is now writeable 
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # COLOR CONVERSION RGB 2 BGR
    return image, results

def draw_styled_landmarks(image, results):
    if results.multi_hand_landmarks:
      for hand_landmarks in results.multi_hand_landmarks:
        mp_drawing.draw_landmarks(
            image,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS,
            mp_drawing_styles.get_default_hand_landmarks_style(),
            mp_drawing_styles.get_default_hand_connections_style())

def extract_keypoints(results):
    if results.multi_hand_landmarks:
      for hand_landmarks in results.multi_hand_landmarks:
        rh = np.array([[res.x, res.y, res.z] for res in hand_landmarks.landmark]).flatten() if hand_landmarks else np.zeros(21*3)
        return(np.concatenate([rh]))

# Path for exported data, numpy arrays
DATA_PATH = os.path.join('MP_Data')

actions = np.array(['A','B','C'], dtype='<U8')  # UTF-8 for action labels

no_sequences = 30
sequence_length = 30

# Save any text files or numpy files with utf-8 encoding if needed
def save_numpy_data(sequence, action, sequence_num, keypoints):
    np.save(os.path.join(DATA_PATH, action, str(sequence_num), 'keypoints.npy'), keypoints)

# Example for writing to a text file with utf-8 encoding
def write_text_file(filepath, content):
    with open(filepath, "w", encoding='utf-8') as f:
        f.write(content)
