"""Build numerical distance/normal data from a traced outline; never edit foot3."""
from pathlib import Path
import json
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
outline = json.loads((root / 'image/butterfly-contour.json').read_text())
w, h = 696, 384
y, x = np.mgrid[0:h, 0:w].astype(float)
x = (x + .5) * outline['width'] / w
y = (y + .5) * outline['height'] / h
distance = np.full((h, w), 1e10)
inside = np.zeros((h, w), bool)
points = outline['points']
for a, b in zip(points, points[1:] + points[:1]):
    ax, ay = a; bx, by = b
    vx, vy = bx-ax, by-ay
    t = np.clip(((x-ax)*vx + (y-ay)*vy) / (vx*vx+vy*vy), 0, 1)
    distance = np.minimum(distance, np.hypot(x-ax-t*vx, y-ay-t*vy))
    if by != ay:
        inside ^= ((ay > y) != (by > y)) & (x < ax+(y-ay)*vx/vy)
distance[inside] *= -1
gy, gx = np.gradient(distance)
length = np.maximum(np.hypot(gx, gy), 1e-6)
encoded = np.rint(np.clip((distance+512)/1024, 0, 1)*65535).astype(np.uint16)
rgba = np.stack([encoded >> 8, encoded & 255,
                 np.rint((np.arctan2(gy, gx)/np.pi*.5+.5)*255),
                 np.full((h, w), 255)], axis=-1).astype(np.uint8)
Image.fromarray(rgba).save(root / 'image/butterfly-field.png')
print('Built signed distance and normals:', w, h)
