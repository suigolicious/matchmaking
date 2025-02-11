from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Matchmaking ML API is Running! 🚀"})

@app.route('/match', methods=['POST'])
def match_users():
    data = request.json
    user_id = data.get('userId')
    answers = data.get('answers')

    # Placeholder matchmaking logic (replace with ML model)
    matches = [{"match_id": 1, "compatibility": 87}, {"match_id": 2, "compatibility": 75}]
    
    return jsonify({"userId": user_id, "matches": matches})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
