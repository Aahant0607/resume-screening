# Resume Screening System

## Overview
This project is a Python-based **Resume Screening System** that extracts and ranks resumes based on their similarity to a given job description. It leverages **Natural Language Processing (NLP)** using `spaCy` and **TF-IDF Vectorization** to score resumes based on relevant skills, experience, and education.

## Features
- 📄 **PDF Resume Parsing**: Extracts text from PDF files.
- 🤖 **NLP-Based Information Extraction**: Identifies skills, experience, and education using `spaCy`.
- 📊 **Match Scoring**: Uses **TF-IDF & Cosine Similarity** to rank resumes.
- 🏆 **Sorted Output**: Resumes are ranked based on their match percentage.
- 📋 **Tabular Display**: Results are presented in a well-structured format using `pandas`.

## Installation
### Prerequisites
Ensure you have **Python 3.7+** installed, then install the required dependencies:

```bash
pip install -r requirements.txt
```

### Required Libraries
If `requirements.txt` is unavailable, manually install dependencies:

```bash
pip install fitz spacy pandas scikit-learn tabulate
python -m spacy download en_core_web_sm
```

## Usage
1. **Place resumes** in the `resumes/` folder (PDF format only).
2. **Modify the job description** inside `screening.py`.
3. **Run the script**:
   ```bash
   python screening.py
   ```
4. **View the results** in tabular format.

## Example Output
```
+----------------------------+-----------------------------+----------------------+----------------------+--------------+
| Resume                     | Skills                      | Experience           | Education            | Match Score  |
+----------------------------+-----------------------------+----------------------+----------------------+--------------+
| candidate_1.pdf            | Python, Machine Learning   | 3 years | 2019-2022  | B.Tech in CS        | 82%          |
| candidate_2.pdf            | AI, NLP, SQL               | 5 years | 2015-2020  | M.Sc in Data Science | 78%          |
+----------------------------+-----------------------------+----------------------+----------------------+--------------+
```

## Future Enhancements
🚀 **Planned Improvements:**
- 🔍 **More Accurate Skill Extraction** using advanced NLP models.
- 🏆 **Better Resume Ranking** by incorporating industry-specific weights.
- 📊 **Web Interface** for an interactive experience.
- 🎯 **Support for Multiple File Formats** (DOCX, TXT, etc.).
- 🔗 **Database Integration** to store and manage candidate data.
- 🛠️ **Job Role-Specific Customization** for different industries.

## Contributing
Built by:
Aahant Kumar , 
Krishna Joshi ,
Shambhavi Singh ,
Tanishka Gupta 

Contributions are welcome! Feel free to fork this repo and submit pull requests. 🚀

## License
This project is licensed under the **MIT License**.

---
💡 *Have suggestions? Open an issue or contribute!*
