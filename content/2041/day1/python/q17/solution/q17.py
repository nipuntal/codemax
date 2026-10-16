#!/usr/bin/env python3
import sys
import re

text = sys.stdin.read()

links = re.findall(r'href="([^"]*)"', text)
emails = re.findall(r'[\w.]+@[\w.]+\.\w+', text)
tags = re.findall(r'<([a-zA-Z][a-zA-Z0-9]*)', text)

print("links:")
for link in links:
    print(link)

print("emails:")
for email in sorted(set(emails)):
    print(email)

counts = {}
for tag in tags:
    tag = tag.lower()
    counts[tag] = counts.get(tag, 0) + 1

summary = " ".join(f"{t}={counts[t]}" for t in sorted(counts))
print(f"tags: {summary}")
