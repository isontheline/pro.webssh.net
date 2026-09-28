"""
Adds a FAQPage JSON-LD block to the pages having "faq_schema: true" inside their frontmatter.

Questions and answers are read from the collapsible blocks of the page :

??? abstract "Question"
    Answer
"""
import json
import re

BLOCK = re.compile(r'^\?\?\?\+? +\w+ +"(?P<question>.+)"[ \t]*\n(?P<answer>(?:(?: {4}.*)?\n)+)', re.MULTILINE)


def plain_text(markdown):
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", markdown)  # Images
    text = re.sub(r"\[\^[^\]]+\]", "", text)  # Footnotes
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)  # Links
    text = re.sub(r"<[^>]+>", "", text)  # HTML tags
    text = re.sub(r":[a-z0-9_+-]+:", "", text)  # Emojis
    text = re.sub(r"[*`]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def on_page_markdown(markdown, page, config, files):
    if not page.meta.get("faq_schema"):
        return markdown

    questions = [
        {
            "@type": "Question",
            "name": plain_text(block.group("question")),
            "acceptedAnswer": {"@type": "Answer", "text": plain_text(block.group("answer"))},
        }
        for block in BLOCK.finditer(markdown + "\n")
    ]
    if not questions:
        return markdown

    schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": questions}
    json_ld = json.dumps(schema, indent=2, ensure_ascii=False).replace("</", "<\\/")

    return markdown + '\n\n<script type="application/ld+json">\n' + json_ld + "\n</script>\n"
