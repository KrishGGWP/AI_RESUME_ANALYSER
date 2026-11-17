import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


SKILLS = [
    "python",
    "java",
    "javascript",
    "c++",
    "sql",
    "html",
    "css",
    "react",
    "node.js",
    "express",
    "fastapi",
    "flask",
    "mongodb",
    "mysql",
    "postgresql",
    "git",
    "github",
    "aws",
    "docker",
    "linux",
    "rest api",
    "machine learning",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "scikit-learn",
    "dsa",
    "data structures",
    "algorithms",
    "oop",
    "dbms"
]


def clean_text(text):

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9+#.\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def find_skills(text):

    text = clean_text(text)

    found = []

    for skill in SKILLS:

        if skill in text:

            found.append(skill)

    return found


def analyze_resume(resume_text, job_description):

    resume_clean = clean_text(resume_text)

    job_clean = clean_text(job_description)


    # TF-IDF similarity

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    vectors = vectorizer.fit_transform(
        [resume_clean, job_clean]
    )

    similarity = cosine_similarity(
        vectors[0:1],
        vectors[1:2]
    )[0][0]


    semantic_score = similarity * 100


    # Skill matching

    resume_skills = set(
        find_skills(resume_clean)
    )

    job_skills = set(
        find_skills(job_clean)
    )


    matching = sorted(
        resume_skills.intersection(job_skills)
    )

    missing = sorted(
        job_skills - resume_skills
    )


    if job_skills:

        skill_score = (
            len(matching) /
            len(job_skills)
        ) * 100

    else:

        skill_score = 0


    # Combined score

    final_score = round(
        (semantic_score * 0.6) +
        (skill_score * 0.4)
    )


    suggestions = []


    if missing:

        suggestions.append(
            "Consider adding missing skills only if you genuinely have them."
        )


    if final_score < 50:

        suggestions.append(
            "Improve alignment between your resume and the job description."
        )

    elif final_score < 75:

        suggestions.append(
            "Your resume has a moderate match. Highlight more relevant projects and skills."
        )

    else:

        suggestions.append(
            "Your resume has a strong match with this job description."
        )


    return {

        "score": final_score,

        "matching_keywords": matching,

        "missing_keywords": missing,

        "suggestions": suggestions

    }