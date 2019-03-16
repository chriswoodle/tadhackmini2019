import requests
import sys
import json 
from dotenv import load_dotenv
import os 
load_dotenv()

message = sys.argv[1]
language = sys.argv[2]
api_key = os.getenv("GOOGLE_TRANSLATE_KEY")




def get_translate(language, message, translate_api):
    lang_code = get_language(language)
    params = {'q':message, 'target':lang_code, 'key':translate_api }
    r = requests.get('https://translation.googleapis.com/language/translate/v2', params)
    value = r.json()
    new_text = value['data']['translations'][0]
    return new_text


def get_language(language_name):
    language_reference = {
    'Afrikaans':    'af',
    'Albanian':    'sq',
    'Amharic':    'am',
    'Arabic':    'ar',
    'Armenian':    'hy',
    'Azerbaijani':    'az',
    'Basque':    'eu',
    'Belarusian':    'be',
    'Bengali':    'bn',
    'Bosnian':    'bs',
    'Bulgarian':    'bg',
    'Catalan':    'ca',
    'Chinese':    'zh-CN ',
    'Corsican':    'co',
    'Croatian':    'hr',
    'Czech':    'cs',
    'Danish':    'da',
    'Dutch':    'nl',
    'English':    'en',
    'Esperanto':    'eo',
    'Estonian':    'et',
    'Finnish':    'fi',
    'French':    'fr',
    'Frisian':    'fy',
    'Galician':    'gl',
    'Georgian':    'ka',
    'German':    'de',
    'Greek':    'el',
    'Gujarati':    'gu',
    'Haitian Creole':    'ht',
    'Hausa':    'ha',
    'Hebrew':    'he',
    'Hindi':    'hi',
    'Hungarian':    'hu',
    'Icelandic':    'is',
    'Igbo':    'ig',
    'Indonesian':    'id',
    'Irish':    'ga',
    'Italian':    'it',
    'Japanese':    'ja',
    'Javanese':    'jw',
    'Kannada':    'kn',
    'Kazakh':    'kk',
    'Khmer':    'km',
    'Korean':    'ko',
    'Kurdish':    'ku',
    'Kyrgyz':    'ky',
    'Lao':    'lo',
    'Latin':    'la',
    'Latvian':    'lv',
    'Lithuanian':    'lt',
    'Luxembourgish':    'lb',
    'Macedonian':    'mk',
    'Malagasy':    'mg',
    'Malay':    'ms',
    'Malayalam':    'ml',
    'Maltese':    'mt',
    'Maori':    'mi',
    'Marathi':    'mr',
    'Mongolian':    'mn',
    'Myanmar (Burmese)':    'my',
    'Nepali':    'ne',
    'Norwegian':    'no',
    'Nyanja':    'ny',
    'Pashto':    'ps',
    'Persian':    'fa',
    'Polish':    'pl',
    'Portuguese':    'pt',
    'Punjabi':    'pa',
    'Romanian':    'ro',
    'Russian':    'ru',
    'Samoan':    'sm',
    'Scots Gaelic':    'gd',
    'Serbian':    'sr',
    'Sesotho':    'st',
    'Shona':    'sn',
    'Sindhi':    'sd',
    'Sinhala':	'si',
    'Slovak':    'sk',
    'Slovenian':    'sl',
    'Somali':    'so',
    'Spanish':    'es',
    'Sundanese':    'su',
    'Swahili':    'sw',
    'Swedish':    'sv',
    'Filipino':    'tl',
    'Tajik':    'tg',
    'Tamil':    'ta',
    'Telugu':    'te',
    'Thai':    'th',
    'Turkish':    'tr',
    'Ukrainian':    'uk',
    'Urdu':    'ur',
    'Uzbek':    'uz',
    'Vietnamese':    'vi',
    'Welsh':    'cy',
    'Xhosa':    'xh',
    'Yiddish':    'yi',
    'Yoruba':    'yo',
    'Zulu' :    'zu'
    }

    lang_code = language_reference[language_name]
    return lang_code


print(get_translate(language, message, api_key))
