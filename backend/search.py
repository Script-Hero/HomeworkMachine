from googlesearch import search # pip insatll google
from quizlet import QuizletParser
import spacy
nlp = spacy.load("en_core_web_lg") # python -m spacy download en_core_web_lg
from datetime import datetime
import pprint
import json
import string
from flask_socketio import emit
from nltk.corpus import stopwords
from nltk import download

from eventlet import sleep

download('stopwords')


def cleanText(text):
    output = text.lower()
    output = output.translate(str.maketrans('', '', string.punctuation))
    return output

def lemmantize(text):
    # assume text is a nlp object
    lemmatized_text = ""
    for token in text:
        if not token.text in stopwords and token.text != "\"":
            lemmatized_text += token.lemma_ + " "
    return nlp(lemmatized_text)


printer = pprint.PrettyPrinter(indent=2,sort_dicts=False)

stopwords = stopwords.words('english')

questions = [
    #{"topic": "civil war", "question" : "who freed the slaves"},
    #{"topic" : "civil war", "question" : "who did emancipation proclamation"},
    #{"topic" : "federalist 10", "question" : "what are two methods of curing factions"},
    #{"topic" : "calculus unit 1", "question" : "derivative formula"},
    #{"topic" : "macbeth", "question":"In Scene 1, where do the witches plan to meet again and why?"},
    #{"topic" : "macbeth", "question":"What do the witches predict for Macbeth?"},
    #{"topic" : "macbeth", "question":"How does Banquo’s reaction to the witches differ from Macbeth’s?"}

    #{"topic":'macbeth', 'question':"What is the significance of Macbeth saying, So foul and fair a day I have not seen (I.iii.38)?"},
    #{"topic":'macbeth', 'question':"What is the implication of what Banquo says upon seeing the witches? You should be women, / And yet your beards forbid me to interpret / that you are so” (I.iii.39-40)."},
    #{"topic":'macbeth', 'question':"What conflict rages in Macbeth after he hears the witches’ prophecy?"},


    #{"topic" : "federalist 10", "question" : "according to madison what is the primary cause of conflict"},
    #{"topic" : "federalist 10", "question" : "how does federalism control factions"},
    #{"topic" : "federalist 10", "question" : "why are factions controlled in large republic"}
    #{"topic":"civil war", "question" :"who did the emancipation proclamation"},
    #{"topic":"civil war", "question" : "who is abraham lincoln"},
    #{"topic" : "calculus", "question" : "what is the formula of the derivative"}

    {"topic":"chapter 11 interest groups", "question":"How is an interest group different from a political party?"},
    {"topic":"chapter 11 interest groups", "question":"Which of the following is not a function of an interest group? "},
    {"topic":"chapter 11 interest groups", "question":"An example of an interest group that would promote a specific cause is "},
    {"topic":"chapter 11 interest groups", "question":"An example of a public interest group is "},
    {"topic":"chapter 11 interest groups", "question":"A method of lobbying by which interest group members and others outside the organization write letters, send telegrams, and make telephone calls to influence policymakers is known as"},
    {"topic" : "chapter 11 interest groups", "question":"Which of the following is true regarding the regulation of lobbying? "},
    {"topic" : "chapter 11 interest groups", "question":"Which is true of government regulation of the media?"},
    {"topic":"chapter 11 interest groups", "question":" In the history of radio as a mode of mass media, which American president was first to make the medium a regular feature of his administration as a method of informing the people?"},
    {"topic":"chapter 11 interest groups", "question":"Which of the following has been an important function in the role of the mass media? I. directing government II. agenda setting III. informing the public IV. shaping public opinion "},
    {"topic":"chapter 11 interest groups", "question":"Those media executives and news editors who decide which events to present and how to pres ent the news are called "}

]

def searchBatch(questions, socket=False):
    print("received search")
    if socket:
        emit("received", {"message":"Received!"})
        sleep(0)
    data = {}

    SEARCHBY = ["term", "definition"]# search by term or definition
    question_index = 0

    for question in questions:
        sleep(0)
        foundAnything = False
        stop = 10
        startSearch = 0
        inc = 3
        sets = 0
        confidence_wall = 0.9


        while not foundAnything and startSearch + inc < stop:
            sleep(0)
            cleanQuestion = cleanText(question['question'])
            data[question['question']] = []
            search_term = cleanText(question['topic']) + " + " + cleanQuestion + " site:quizlet.com"

            responses = list(search(search_term, stop=stop))
            print("Question searched: " + question['question'])
            if socket:
                emit("starting_question", question_index)
            

            #for response in responses[startSearch:startSearch+inc]:
            for response in responses[:startSearch+inc]:
                if sets > 9:
                    break
                sets += 1
                print("Analyzing flashcard set %d" %(sets))
                p = QuizletParser(response)
                if not p:
                    continue
                if socket:
                        emit("starting_set", sets-1)
                # .flashcards {term: question, definition: answer, lastModified: 10DigitTimestamp}


                for card in p.flashcards:
                    for s in SEARCHBY:
                        flashcard_question = card[s]

                        nlpQuestion = nlp(question['question'])
                        nlpFlashcardQuestion = nlp(flashcard_question)
                        val = lemmantize(nlpQuestion).similarity(lemmantize(nlpFlashcardQuestion))
                        #val = nlp(cleanQuestion).similarity(nlp(cleanText(flashcard_question)))

                        clean_card = {
                            "confidence":val,
                            "term":card["term"],
                            "definition":card["definition"],
                            "lastModified":str(datetime.fromtimestamp(card["lastModified"]))
                        }
                        #print(val)
                        if val > confidence_wall:
                            print("Found answer!")
                            foundAnything = True
                            data[question['question']].append(clean_card)
                            if socket:
                                emit("found", question_index)
                                sleep(0)

            if not foundAnything:
                #stop += 3
                startSearch += inc
                confidence_wall -= 0.05
                print("Deepening search!")
        question_index += 1
    # sort the answers with the higest correlation first
    for q in data:
        data[q] = sorted(data[q], key = lambda i: i['confidence'], reverse=True)

    if socket:
        emit("complete", data)
        sleep(0)
    print("Done.")
    return data
 #Haha you have found this easter egg - Triet Banh
#a = searchBatch(questions)
#printer.pprint(a)

#with open("OUT.json", 'w') as file:
#    json.dump(a,file )
print("Search loaded")