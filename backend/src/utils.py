import re


def clean_text(text):

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s+#.-]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def extract_keywords(text):

    words = set(text.split())

    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "that",
        "this",
        "from",
        "are",
        "you",
        "your",
        "our",
        "have",
        "has",
        "will",
        "can",
        "not",
        "but",
        "into",
        "using"
    }

    keywords = {
        word
        for word in words
        if len(word) > 2
        and word not in stop_words
    }

    return keywords