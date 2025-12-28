import os
from groq import Groq
from dotenv import load_dotenv

# Load env vars from .env file
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

print("--- Groq API Verification Script ---")

if not api_key:
    print("❌ Error: GROQ_API_KEY not found in environment variables.")
    exit(1)

# Mask key for display
masked_key = f"{api_key[:8]}...{api_key[-4:]}"
print(f"✅ Found API Key: {masked_key}")

try:
    client = Groq(api_key=api_key)
    
    print("Reticulating splines... (Sending test request to 'llama-3.3-70b-versatile')")
    
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "user", "content": "Reply with 'Groq API is working!' if you see this."}
        ],
        model="llama-3.3-70b-versatile", 
    )
    
    response = chat_completion.choices[0].message.content
    
    print("\n✅ SUCCESS! Received response from Groq:")
    print("----------------------------------------")
    print(response)
    print("----------------------------------------")

except Exception as e:
    print("\n❌ FAILED! Could not connect to Groq API.")
    print(f"Error details: {e}")
