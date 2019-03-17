import requests
import sys
import json 
import os 
import sklearn 
import pandas as pd 
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer

message = str(sys.argv[1])
language = str(sys.argv[2])
api_key = str(sys.argv[3])

def get_translation(language, message, translate_api):
    lang_code = get_language(language.lower())
    params = {'q':message, 'target':lang_code, 'key':translate_api }
    r = requests.get('https://translation.googleapis.com/language/translate/v2', params)

    if r.status_code == 200:
        resp = r.json()
        new_text = dict(resp['data']['translations'][0])

        # ':' is used to signify a translation, if missing, predicts the question type
        if new_text['translatedText'].count(':') == 0:
            new_text['type'] = classifier(new_text['translatedText'])
        else:
            new_text['type'] = '4'

    else:
        new_text = dict(r.json())
    new_text = json.dumps(new_text)
    return new_text

def get_language( language_name):
    # Gets the abbreviation for the language requested
    #   default to English if unrecognized
    language_reference = {
    'afrikaans':    'af',
    'albanian':    'sq',
    'amharic':    'am',
    'arabic':    'ar',
    'armenian':    'hy',
    'azerbaijani':    'az',
    'basque':    'eu',
    'belarusian':    'be',
    'bengali':    'bn',
    'bosnian':    'bs',
    'bulgarian':    'bg',
    'catalan':    'ca',
    'chinese':    'zh-cn ',
    'corsican':    'co',
    'croatian':    'hr',
    'czech':    'cs',
    'danish':    'da',
    'dutch':    'nl',
    'english':    'en',
    'esperanto':    'eo',
    'estonian':    'et',
    'finnish':    'fi',
    'french':    'fr',
    'frisian':    'fy',
    'galician':    'gl',
    'georgian':    'ka',
    'german':    'de',
    'greek':    'el',
    'gujarati':    'gu',
    'haitian creole':    'ht',
    'hausa':    'ha',
    'hebrew':    'he',
    'hindi':    'hi',
    'hungarian':    'hu',
    'icelandic':    'is',
    'igbo':    'ig',
    'indonesian':    'id',
    'irish':    'ga',
    'italian':    'it',
    'japanese':    'ja',
    'javanese':    'jw',
    'kannada':    'kn',
    'kazakh':    'kk',
    'khmer':    'km',
    'korean':    'ko',
    'kurdish':    'ku',
    'kyrgyz':    'ky',
    'lao':    'lo',
    'latin':    'la',
    'latvian':    'lv',
    'lithuanian':    'lt',
    'luxembourgish':    'lb',
    'macedonian':    'mk',
    'malagasy':    'mg',
    'malay':    'ms',
    'malayalam':    'ml',
    'maltese':    'mt',
    'maori':    'mi',
    'marathi':    'mr',
    'mongolian':    'mn',
    'myanmar (burmese)':    'my',
    'nepali':    'ne',
    'norwegian':    'no',
    'nyanja':    'ny',
    'pashto':    'ps',
    'persian':    'fa',
    'polish':    'pl',
    'portuguese':    'pt',
    'punjabi':    'pa',
    'romanian':    'ro',
    'russian':    'ru',
    'samoan':    'sm',
    'scots gaelic':    'gd',
    'serbian':    'sr',
    'sesotho':    'st',
    'shona':    'sn',
    'sindhi':    'sd',
    'sinhala':	'si',
    'slovak':    'sk',
    'slovenian':    'sl',
    'somali':    'so',
    'spanish':    'es',
    'sundanese':    'su',
    'swahili':    'sw',
    'swedish':    'sv',
    'filipino':    'tl',
    'tajik':    'tg',
    'tamil':    'ta',
    'telugu':    'te',
    'thai':    'th',
    'turkish':    'tr',
    'ukrainian':    'uk',
    'urdu':    'ur',
    'uzbek':    'uz',
    'vietnamese':    'vi',
    'welsh':    'cy',
    'xhosa':    'xh',
    'yiddish':    'yi',
    'yoruba':    'yo',
    'zulu' :    'zu'
    }

    lang_list = list(language_reference.keys())
    in_lang = lang_list.count(language_name)
    if in_lang > 0:
        language_name = language_reference.get(language_name, 'en')
    return language_name





def classifier(message):
    # cur_directory = 'C:/Users/h3576/OneDrive - University of Florida/Projects/tadhackmini2019/scripts'
    # os.chdir(cur_directory)
    df_data = pd.read_csv('classifier_data.csv')
    df_data = df_data.loc[df_data['Target'] != 4]
    vectorizer = TfidfVectorizer()
    vectorizer.fit_transform(df_data['Text'])
    temp = vectorizer.transform(df_data['Text'])



    # Model Builder
    new_question = 'where is Mcdonalds?'
    clf = RandomForestClassifier()
    clf.fit(temp, df_data['Target'])
    input_question = vectorizer.transform([message])
    return str(clf.predict(input_question)[0])

# Cases
# 1 FindNearest
# 2 Navigate
# 3 MedicineLookup
# 4 Translate
# 5 WhatDis
# 6 News
# 7 Help
# 8 Hello
# 9 Stop

print(get_translation(language, message, api_key))