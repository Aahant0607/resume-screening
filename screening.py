import fitz  # PyMuPDF for PDF extraction
import spacy
import os
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text.strip()

# Extract skills, experience, and education
def extract_details(text):
    doc = nlp(text)
    
    skills = []
    experience = []
    education = []
    
    skill_keywords = {"Python", "Java", "Machine Learning", "Data Science", "SQL", "AI", "NLP"}
    edu_keywords = {"Bachelor", "Master", "B.Sc", "M.Sc", "PhD", "B.E", "M.E", "B.Tech", "M.Tech"}

    # Extract skills
    for ent in doc.ents:
        if any(word in ent.text for word in skill_keywords):
            skills.append(ent.text)

    # Extract education
    for sent in doc.sents:
        if any(word in sent.text for word in edu_keywords):
            education.append(sent.text.strip())

    # Extract experience using regex
    experience_patterns = [
        r"(\d{1,2})\s*(years|months)",  # Matches "5 years", "3 months"
        r"(\d{4})\s*[-to]*\s*(\d{4})"  # Matches "2019-2023", "2018 to 2022"
    ]
    
    for pattern in experience_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            experience.append(" ".join(match))

    return {
        "skills": list(set(skills)),
        "experience": " | ".join(experience) if experience else "Not found",
        "education": " | ".join(education) if education else "Not found"
    }

# Calculate similarity score
def calculate_match_score(resume_text, job_desc):
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, job_desc])
    similarity = cosine_similarity(vectors)[0][1]
    return round(similarity * 100, 2)  # Convert to percentage

# Process multiple resumes
def process_resumes(resume_folder, job_desc):
    results = []
    
    for file in os.listdir(resume_folder):
        if file.endswith(".pdf"):
            file_path = os.path.join(resume_folder, file)
            text = extract_text_from_pdf(file_path)
            details = extract_details(text)
            match_score = calculate_match_score(text, job_desc)
            
            results.append({
                "Resume": file,
                "Skills": ", ".join(details["skills"]),
                "Experience": details["experience"],
                "Education": details["education"],
                "Match Score": f"{match_score}%"  # Display as percentage
            })

    return sorted(results, key=lambda x: float(x["Match Score"].strip('%')), reverse=True)

# Example Usage
if __name__ == "__main__":
    job_description = """We are looking for a Data Scientist with expertise in Python, Machine Learning, and SQL.
                         Experience with AI and NLP is a plus. A Bachelor's or Master's degree in Computer Science is required."""

    resume_folder = "resumes/"  # Folder containing PDF resumes
    ranked_resumes = process_resumes(resume_folder, job_description)

    # Convert results to DataFrame
    df = pd.DataFrame(ranked_resumes)

    # ✅ Fix truncated output issue & improve readability
    pd.set_option("display.max_colwidth", None)  # Prevents truncation of long text
    pd.set_option("display.expand_frame_repr", False)  # Keeps output in a single line

    # ✅ Properly formatted output
    try:
        from tabulate import tabulate  # Import tabulate for markdown table
        print(tabulate(df, headers="keys", tablefmt="grid"))  # Grid format for better readability
    except ImportError:
        print(df.to_string(index=False))  # Fallback in case tabulate is not installed
