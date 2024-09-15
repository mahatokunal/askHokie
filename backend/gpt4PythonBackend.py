import openai
from pymongo import MongoClient
from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
import torch
import re

# Set your OpenAI API key
openai.api_key = "sk-CZKXy8eI3pARLRk4zFVVUzF3e5L6s4QnIkaIdDBbqMT3BlbkFJvZVDjconbVTWLYYbM0LXviqgdyiYbuoIm9pQKu1q4A"

# MongoDB Atlas setup
client = MongoClient("mongodb+srv://swapnilsingh:ganpati@cluster0.ydftg.mongodb.net/")
db = client['vt_chatbot']
pages_collection = db['pages']

# Load the sentence embedding model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# FastAPI setup
app = FastAPI()

class QueryRequest(BaseModel):
    query: str  # The query field must be a string

def get_relevant_docs(query, k=3):
    query_embedding = embedding_model.encode(query).tolist()
    response = pages_collection.aggregate([
        {
            "$vectorSearch": {
                "queryVector": query_embedding,
                "path": "embedding",
                "numCandidates": 100,
                "limit": k,
                "index": "PlotSemanticSearch"
            }
        }
    ])
    relevant_docs = [doc['content'] for doc in response]
    return relevant_docs

def replace_vt_with_virginia_tech(query):
    # Replace standalone 'vt' with 'Virginia Tech' (case-sensitive)
    query = re.sub(r'\bVT\b', 'Virginia Tech', query)
    # Replace standalone 'vt' with 'virginia tech' (case-insensitive)
    query = re.sub(r'\bvt\b', 'virginia tech', query)
    return query

def generate_response_with_gpt4(prompt, context, model="gpt-4-turbo"):
    if not context:
        return "I'm sorry, I couldn't find relevant information in the database."

    # System message that strictly enforces responding only with the provided context
    messages = [
        {"role": "system", "content": "You are a helpful assistant. You will only respond based on the given context. vt or VT reffers to virginia tech or Virginia Tech."},
        {"role": "user", "content": f"User's query: {prompt}\n\nContext (from database):\n{context}"}
    ]

    response = openai.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=500,
        temperature=0.0
    )
    return  response.choices[0].message.content.strip()

@app.post("/query")
async def query_vt_chatbot(request: QueryRequest):
    # Preprocess the query to replace 'vt' or 'VT' with 'Virginia Tech'
    processed_query = replace_vt_with_virginia_tech(request.query)
    
    relevant_docs = get_relevant_docs(processed_query)
    print(len(relevant_docs))
    if not relevant_docs:
        return {"response": "I'm sorry fellow Hokie, I couldn't find any relevant information related to Virginia Tech for your query."}
    
    context = "\n".join(relevant_docs)
    response = generate_response_with_gpt4(processed_query, context)
    print(response)
    
    return {"response": response}

