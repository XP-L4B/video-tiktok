"""Track the speaker's face (normalized center + size) at 5 fps, smoothed, for masks/reframing."""
import cv2, json, sys
import numpy as np

src, out = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS)
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
step = int(round(fps / 5))  # note: source is VFR, so timestamps come from POS_MSEC
pts, i, last = [], 0, (0.5, 0.27, 0.22)
while True:
    ok, fr = cap.read()
    if not ok:
        break
    if i % step == 0:
        h, w = fr.shape[:2]
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        faces = casc.detectMultiScale(g, 1.1, 6, minSize=(w // 8, w // 8))
        if len(faces):
            x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])
            c = ((x + fw / 2) / w, (y + fh / 2) / h, fw / w)
            if abs(c[0] - last[0]) < 0.25 and abs(c[1] - last[1]) < 0.2:
                last = c
        pts.append([cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0, *last])
    i += 1
a = np.array(pts)
k = 9  # ~1.8s moving average keeps virtual camera calm
for col in (1, 2, 3):
    pad = np.pad(a[:, col], (k // 2, k // 2), mode="edge")
    a[:, col] = np.convolve(pad, np.ones(k) / k, mode="valid")
json.dump([[round(v, 4) for v in r] for r in a.tolist()], open(out, "w"))
print(len(a), a[:, 1].min(), a[:, 1].max(), a[:, 2].min(), a[:, 2].max(), a[:, 3].mean())
