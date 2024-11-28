# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import pytesseract
from PIL import Image
import pdfplumber
from docx import Document
import requests
from bs4 import BeautifulSoup
from database import Session, SavedData
import json
from datetime import datetime
import tempfile


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload/pdf', methods=['POST'])
def process_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    text = []
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            text.append(page.extract_text())
    
    os.remove(filepath)
    return jsonify({'text': '\n'.join(text)})

@app.route('/upload/image', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    image = Image.open(filepath)
    text = pytesseract.image_to_string(image)
    
    os.remove(filepath)
    return jsonify({'text': text})

@app.route('/upload/csv', methods=['POST'])
def process_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    df = pd.read_csv(filepath)
    data = df.to_dict('records')
    
    os.remove(filepath)
    return jsonify({'data': data})

@app.route('/process/url', methods=['POST'])
def process_url():
    url = request.json.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    text = soup.get_text()
    
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)

app.py
