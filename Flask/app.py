from flask import Flask, jsonify, request, render_template
from opanalysis import opanalysis

app = Flask(__name__)

@app.route('/')
def index():
     return render_template('index.html')

@app.route('/opa', methods=['POST'])
def opa():
    if request.method == 'POST':
        netlist = request.form['netlist']
        return jsonify(opanalysis(netlist))

if __name__ == '__main__' :
    app.run(debug=True)

