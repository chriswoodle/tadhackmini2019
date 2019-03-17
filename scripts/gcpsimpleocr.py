import io
import os
import sys
import json

uri = sys.argv[1]

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

# Instantiates a client
client = vision.ImageAnnotatorClient.from_service_account_json('gc.json')


image = types.Image()
image.source.image_uri = uri

# Performs label detection on the image file
response = client.text_detection(image=image)
##labels = response.label_annotations

texts = response.text_annotations

txts = []


for text in texts:
        ##print('\n"{}"'.format(text.description))
        txt = {}
        txt["text"] = text.description

        txts.append(txt)

        ##print (text.description)

##        vertices = (['({},{})'.format(vertex.x, vertex.y)
##                    for vertex in text.bounding_poly.vertices])

js = json.dumps(txts)

print (js)
