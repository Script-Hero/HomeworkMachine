from pdfminer.high_level import extract_text

with open("./input.pdf", "rb") as file:
    text = extract_text(file)

print(text)