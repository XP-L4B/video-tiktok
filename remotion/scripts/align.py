"""Align the authoritative script text to Whisper word timestamps -> src/data/words.json."""
import json, re, difflib, unicodedata

def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", t)

wh = [w for s in json.load(open("scripts/whisper.json")) for w in s["words"]]
# merge whisper's split elisions ("l" + "'utilizzo")
ww = []
for w in wh:
    if ww and w["w"].startswith("'"):
        ww[-1] = {"w": ww[-1]["w"] + w["w"], "s": ww[-1]["s"], "e": w["e"]}
    else:
        ww.append(dict(w))
wn = [norm(w["w"]) for w in ww]

text = open("scripts/script.txt").read()
toks = []
for pi, para in enumerate(text.strip().split("\n")):
    for t in para.split():
        toks.append({"t": t, "p": pi})
tn = [norm(t["t"]) for t in toks]

sm = difflib.SequenceMatcher(a=tn, b=wn, autojunk=False)
for blk in sm.get_opcodes():
    tag, a0, a1, b0, b1 = blk
    if tag == "equal" or (tag == "replace" and a1 - a0 == b1 - b0):
        for k in range(a1 - a0):
            toks[a0 + k]["s"], toks[a0 + k]["e"] = ww[b0 + k]["s"], ww[b0 + k]["e"]
    elif tag == "replace":
        s, e = ww[b0]["s"], ww[b1 - 1]["e"]
        n = a1 - a0
        for k in range(n):
            toks[a0 + k]["s"] = s + (e - s) * k / n
            toks[a0 + k]["e"] = s + (e - s) * (k + 1) / n
# fill gaps (script words whisper dropped)
for i, t in enumerate(toks):
    if "s" not in t:
        j = i
        while j < len(toks) and "s" not in toks[j]:
            j += 1
        s = toks[i - 1]["e"] if i else 0
        e = toks[j]["s"] if j < len(toks) else s + 0.3 * (j - i)
        n = j - i
        for k in range(n):
            toks[i + k]["s"] = s + (e - s) * k / n
            toks[i + k]["e"] = s + (e - s) * (k + 1) / n
# manual fixes from a focused re-transcription of 87.5-90.5s (Whisper dropped two words)
FIX = {279: (88.68, 88.94), 280: (88.94, 89.34), 281: (89.36, 89.40), 282: (89.40, 89.80)}
for i, (s, e) in FIX.items():
    toks[i]["s"], toks[i]["e"] = s, e
for t in toks:
    t["s"], t["e"] = round(t["s"], 3), round(max(t["e"], t["s"] + 0.06), 3)
json.dump(toks, open("src/data/words.json", "w"), ensure_ascii=False)
for i, t in enumerate(toks):
    print(i, t["s"], t["t"])
