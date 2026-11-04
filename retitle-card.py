"""Setzt den Titel der Londoner Workshop-Karte neu.

Die Grafik kam aus Figma mit dem Platzhalter "FUTURE THINKING WORKSHOP". Der
Workshop heisst "Think Before You Build" — so steht er auf
experiencehaus.ddxconference.com und so nennt Amit ihn. Statt die Datei in
Figma neu zu exportieren wird hier nur die Schrift ersetzt.

Masse aus dem Original zurueckgerechnet, nicht geschaetzt: die Versalhoehe
der Zeilen (75 / 77 px) gibt die Groesse 112, die gemessene Zeilenbreite
gegen die natuerliche Breite derselben Zeichenfolge gibt die **negative
Laufweite** — FUTURE -7.0 px, WORKSHOP -9.4 px, also rund -6 bis -8 % der
Schriftgroesse. Ohne sie steht der Satz sichtbar zu luftig (so sah die erste
Fassung aus, mit 103 und Laufweite 0).

Weggenommen wird nur der alte Satz selbst, nicht sein Kasten: die Lettern
sind reines Weiss, das Foto dahinter ist warm — darum die Maske ueber
Helligkeit *und* Buntheit. Ein rechteckiger Weichzeichner wuerde den Stift
und die Hand mitverwischen.
"""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

SRC = "/Users/sebastiangier/Documents/Claude/Projects/FastForward Global/ddx-experiencehaus/exp-1.future-thinking.orig.jpg"  # immer vom Original, nie von der schon betexteten Datei
FONT = "/System/Library/Fonts/Supplemental/Times New Roman Bold Italic.ttf"
LINES = ("THINK", "BEFORE", "YOU BUILD")
BASELINES = (486, 587, 689)
LEFT, SIZE, TRACK = 50, 112, -7.0

bgr = cv2.imread(SRC)
px = bgr.astype(np.int16)
white = (px.min(2) > 185) & ((px.max(2) - px.min(2)) < 45)
box = np.zeros(white.shape, bool)
box[386:710, 0:690] = True
mask = cv2.dilate((white & box).astype(np.uint8) * 255, np.ones((9, 9), np.uint8))
bgr = cv2.inpaint(bgr, mask, 9, cv2.INPAINT_TELEA)

img = Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
f = ImageFont.truetype(FONT, SIZE)
d = ImageDraw.Draw(img)
for line, base in zip(LINES, BASELINES):
    # Zeichen fuer Zeichen, weil PIL keine Laufweite kennt.
    x = LEFT - f.getbbox(line)[0]
    for ch in line:
        d.text((x, base), ch, "white", font=f, anchor="ls")
        x += f.getlength(ch) + TRACK

img.save("exp-1-new.jpg", quality=92, subsampling=0)
print("ok", img.size, "maskierte Pixel:", int((mask > 0).sum()))
