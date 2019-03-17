import * as path from 'path';
import * as maps from './maps';
import * as child from './child';
import * as sender from './sender';
import * as fda from './fda';

import * as debug from 'debug';
const log = debug('app:handler');

export enum SMSSourceType {
    APIDaze = 'apidaze',
    TeleSign = 'telesign',
    Flowroute = 'flowroute'
}

enum ClassificationMessageTypes {
    FindNearest = '1',
    Navigate = '2',
    Medicine = '3',
    Translate = '4',
    WhatIsThisImahe = '5',
    News = '6',
    Help = '7',
    Hello = '8',
    Stop = '9',
}

interface Cache {
    [number: string]: {
        location?: maps.Location
    }
}

// interface Sessions {
//     [number: string]: {
//         started?: boolean
//     }
// }

interface MessageClassification {
    translatedText: string,
    detectedSourceLanguage: string,
    type: ClassificationMessageTypes
}

// Cache of current sessions, keyed by phone number
const cache: Cache = {};

export function sms(message: string, number: string, sourceType: SMSSourceType) {
    return Promise.resolve()
        .then(() => {
            if (!cache[number]) {
                // new session
                cache[number] = {};
            }
        })
        .then(() => {
            // existing session
            const location = maps.matchGoogleMapsURL(message)
            if (location) {
                console.log(location);
                cache[number].location = location;
                return sendResponseMessage('I have recieved your location', number, sourceType);
            }
        })
        .then(() => {
            return startClassification(message, number, sourceType);
        })
        .then((response) => {
            log(response)
            return handleClassification(message, number, sourceType, response);
        })
        .then(() => {
            return Promise.resolve('complete');
        })
        .catch(() => {
            log('Either error or end!');
            sendResponseMessage('You have discovered the bonus level! https://i.kinja-img.com/gawker-media/image/upload/s--0ivwLoXx--/c_scale,f_auto,fl_progressive,q_80,w_800/jpojwj04rbmzvwnoqnrt.jpg', number, sourceType);
        })
}

export function mms(message: string, number: string, sourceType: SMSSourceType, imageUrl: string) {
    return Promise.resolve()
        .then(() => {
            if (!cache[number]) {
                // new session
                cache[number] = {};
            }
        })
        .then(() => {
            return startClassification(message, number, sourceType);
        })
        .then((response) => {
            log(response)
            switch (response.type) {
                case ClassificationMessageTypes.Medicine:
                    handleMedicineImage(imageUrl).then((medication: string) => {
                        log(medication);
                        return fda.getGeneralDrugName(medication);
                    }).then((response) => {
                        log(response.results);
                        return sendResponseMessage(`I believe this medication is called: ${response.results[0].generic_name}`, number, sourceType);
                    })
                    break;
                case ClassificationMessageTypes.WhatIsThisImahe:
                    return sendResponseMessage('Ok', number, sourceType);
                    break;
            }
        })
        .then(() => {
            return Promise.resolve('complete');
        })
        .catch(() => {
            log('Either error or end!');
            sendResponseMessage('You have discovered the bonus level! https://i.kinja-img.com/gawker-media/image/upload/s--0ivwLoXx--/c_scale,f_auto,fl_progressive,q_80,w_800/jpojwj04rbmzvwnoqnrt.jpg', number, sourceType);
        })
}


function startClassification(message: string, number: string, sourceType: SMSSourceType): Promise<any> {
    return Promise.resolve()
        .then(() => {
            // First, classify the inbound message
            return child.exec<MessageClassification>(path.resolve(__dirname, '../scripts'), 'python3', 'get_translation.py', `"${message}"`, 'English', process.env.GOOGLE_TRANSLATE_KEY as any)
        })
}

function handleClassification(message: string, number: string, sourceType: SMSSourceType, response: MessageClassification) {
    log('handleClassification')
    return new Promise(() => {
        // Handle the classification type
        switch (response.type) {
            case ClassificationMessageTypes.FindNearest:
                if (!cache[number].location) return sendResponseMessage('I need your location to find nearby places.', number, sourceType);
                else {
                }
                break;
            case ClassificationMessageTypes.Navigate:
                return sendResponseMessage('Ok', number, sourceType);

                break;
            case ClassificationMessageTypes.Medicine:
                log(message);
                const words = message.split(' ');
                const medication = words[words.length - 1].replace('?', '');
                log(medication);
                return fda.getGeneralDrugName(medication).then((response) => {
                    log(response.results);
                    return sendResponseMessage(`I believe this medication is called: ${response.results[0].generic_name}`, number, sourceType);
                })
                break;
            case ClassificationMessageTypes.Translate:
                return translate(message).then(response => {
                    log(response)
                    return sendResponseMessage(response.translatedText, number, sourceType);
                })
                break;
            case ClassificationMessageTypes.WhatIsThisImahe:
                return sendResponseMessage('Ok', number, sourceType);
                break;
            case ClassificationMessageTypes.News:
                return sendResponseMessage('Ok', number, sourceType);
                break;
            case ClassificationMessageTypes.Help:
                return sendResponseMessage('Ok', number, sourceType);
                break;
            case ClassificationMessageTypes.Hello:
                const hi = `Hello, Welcome to CityAssistant!
You can: 
  Ask to find nearby places
  Get directions
  Get generic medication/drug names
  List some local news
  Ask for help
  Get local authority information
                `;
                return sendResponseMessage(hi, number, sourceType);
                break;
            case ClassificationMessageTypes.Stop:
                return sendResponseMessage('Ok, bye bye now :)', number, sourceType);
                break;
        }
    });
}


function sendResponseMessage(message: string, number: string, sourceType: SMSSourceType) {
    log('sendResponseMessage', message)
    switch (sourceType) {
        case SMSSourceType.APIDaze:
            return sender.sendApidazeSMS(message, number).then(() => {
                return Promise.resolve();
            })
            break;
        case SMSSourceType.Flowroute:
            return sender.sendFlowrouteSMS(message, number).then(() => {
                return Promise.resolve();
            })
            break;
        case SMSSourceType.TeleSign:
            return sender.sendTelesignSMS(message, number).then(() => {
                return Promise.resolve();
            })
            break;
        default:
            return Promise.resolve();
    }
}

interface ImageOCRResponse {
    text: string
}

function handleMedicineImage(imageUrl: string) {
    return Promise.resolve()
        .then(() => {
            return child.exec<ImageOCRResponse[]>(path.resolve(__dirname, '../scripts'), 'python3', 'gcpsimpleocr.py', imageUrl)
        })
        .then((response) => {
            const line = response[0].text;
            let medication;
            if (line.indexOf('\n') > 0) {
                medication = line.substring(0, line.indexOf('\n'));
            } else {
                medication = line;
            }
            log(medication);
            return medication;
        });
}

function translate(message: string) {
    return child.exec<any>(path.resolve(__dirname, '../scripts'), 'python3', 'translate.py', `"${message}"`, process.env.GOOGLE_TRANSLATE_KEY as any)
}