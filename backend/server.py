from search import searchBatch
from flask import Flask, request
from flask_socketio import SocketIO, emit
import eventlet
eventlet.monkey_patch()

app = Flask(__name__)


PORT = 3000
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:%d"%(PORT)], async_handlers=True)

@app.route('/search', methods=['POST'])
def search():
    print(request.json)
    cards = request.json.get("cards") # [{topic, question}, {topic, question}]
    return searchBatch(cards)


'''
=== EMITS ===
received 
ping : {"question_index" : int}
complete : data_dictionary
'''
@socketio.on("search")
def socket_search(body):
    
    cards = body['cards']
    data = searchBatch(cards, socket=True) # emits updates on searching new question and found answer, emits complete w all data on complete
    return data
# export FLASK_APP = server
# python3 -m flask
print("Server ready.")
socketio.run(app)
