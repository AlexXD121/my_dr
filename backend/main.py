import os
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from config import GROQ_API_KEY

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:5173",  # React default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    timestamp: str

# Groq Client
# Initialize client only if key is present to avoid immediate crash, but endpoint will check.
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Groq API Key not configured in backend")
    
    try:
        # Prepare messages
        messages = [
            {"role": "system", "content": "You are MyDoc, a helpful and empathetic medical assistant."}
        ]
        
        # Append history if provided
        if request.history:
            messages.extend(request.history)
        
        # Append current user message
        messages.append({"role": "user", "content": request.message})

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile", 
        )
        
        ai_response = chat_completion.choices[0].message.content
        
        return ChatResponse(
            response=ai_response,
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while communicating with the AI.")

@app.get("/")
def read_root():
    return {"message": "MyDoc API is running"}
