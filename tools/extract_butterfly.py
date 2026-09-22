import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = 'image/foot3.webp'
im = Image.open(SRC).convert('RGB')
W, H = im.size
print('source:', SRC, W, 'x', H)
a = np.array(im).astype(np.float64)
lum = 0.299*a[:,:,0] + 0.587*a[:,:,1] + 0.114*a[:,:,2]

# ---------- 1) extract FULL butterfly (low threshold, wide region) ----------
x0, x1 = 380, 1120
y0, y1 = 0, 552
sub = lum[y0:y1, x0:x1]
sh, sw = sub.shape
# per-row background estimate from left+right margins (handles vertical gradient)
bg_row = (np.median(sub[:, :45], axis=1) + np.median(sub[:, -45:], axis=1)) / 2.0
alpha = np.clip((sub - bg_row[:, None]) / 30.0, 0, 1)
alpha = np.array(Image.fromarray((alpha*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float64)/255.0
m = 16
yy, xx = np.mgrid[0:sh, 0:sw]
alpha *= np.clip(np.minimum(np.minimum(xx/m, (sw-1-xx)/m), np.minimum(yy/m, (sh-1-yy)/m)), 0, 1)
# keep only the butterfly component, drop stray glow
mask = alpha > 0.22
lbl, n = ndimage.label(mask)
comps = []
for i in range(1, n+1):
    cys, cxs = np.where(lbl == i)
    comps.append((len(cxs), i, cxs.min(), cxs.max(), cys.min(), cys.max()))
comps.sort(reverse=True)
print('top components (size, bbox):')
for sz, i, cx0, cx1, cy0, cy1 in comps[:5]:
    print('  size=%d x[%d,%d] y[%d,%d]' % (sz, x0+cx0, x0+cx1, y0+cy0, y0+cy1))
keep = (lbl == comps[0][1])
keep = np.array(Image.fromarray((keep*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31))) > 8
alpha *= keep.astype(np.float64)

ys, xs = np.where(alpha > 0.02)
px0, px1, py0, py1 = xs.min(), xs.max(), ys.min(), ys.max()
px0=max(0,px0-6); py0=max(0,py0-6); px1=min(sw-1,px1+6); py1=min(sh-1,py1+6)
rgba = np.dstack([a[y0:y1, x0:x1], alpha*255]).astype(np.uint8)[py0:py1+1, px0:px1+1]
bimg = Image.fromarray(rgba, 'RGBA')
GX0, GY0 = x0+px0, y0+py0
GW, GH = bimg.size
print('BUTTERFLY rect in foot3: x=%d y=%d w=%d h=%d center=(%.0f,%.0f)' % (GX0, GY0, GW, GH, GX0+GW/2., GY0+GH/2.))
print('fracs: left=%.4f top=%.4f w=%.4f h=%.4f' % (GX0/W, GY0/H, GW/W, GH/H))
bimg.save('image/butterfly.webp', 'WEBP', quality=92, method=6)
print('butterfly.webp bytes:', os.path.getsize('image/butterfly.webp'))

al = rgba[:,:,3].astype(float)
gw2, gh2 = 60, 62
als = np.array(Image.fromarray(al.astype(np.uint8)).resize((gw2, gh2), Image.LANCZOS)).astype(float)
chars=' .:-=+*#%@'; mx=max(als.max(),1)
print('alpha ascii (@=opaque):')
for r in als: print(''.join(chars[min(int(v/mx*9),8)] for v in r))

# ---------- 2) clean plate: remove butterfly from background ----------
hole = np.zeros((H, W), bool)
hole[y0:y1, x0:x1] = alpha > 0.02
hole = np.array(Image.fromarray((hole*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(13))) > 8
boxlim = np.zeros((H, W), bool); boxlim[y0:y1, x0:x1] = True
hole &= boxlim
print('hole px:', int(hole.sum()))

clean = a.copy()
reg_mean = a[hole].mean(axis=0)
for c in range(3):
    ch = clean[:,:,c]; ch[hole] = reg_mean[c]

def jacobi(img, msk, iters):
    for _ in range(iters):
        avg = (np.roll(img,1,0)+np.roll(img,-1,0)+np.roll(img,1,1)+np.roll(img,-1,1))/4.0
        for c in range(3):
            ch=img[:,:,c]; ch[msk]=avg[:,:,c][msk]
    return img

S = 8
Ws, Hs = W//S, H//S
small = np.array(Image.fromarray(np.clip(clean,0,255).astype(np.uint8)).resize((Ws,Hs), Image.BOX)).astype(np.float64)
hole_s = np.array(Image.fromarray((hole*255).astype(np.uint8)).resize((Ws,Hs), Image.BOX)) > 40
hole_s = ndimage.binary_dilation(hole_s, iterations=2)
small = jacobi(small, hole_s, 500)
small_up = np.array(Image.fromarray(np.clip(small,0,255).astype(np.uint8)).resize((W,H), Image.BICUBIC)).astype(np.float64)
for c in range(3):
    ch=clean[:,:,c]; ch[hole]=small_up[:,:,c][hole]
clean = jacobi(clean, hole, 80)

# grain noise matched to surroundings
ring = ndimage.binary_dilation(hole, iterations=10) & ~hole
blur = np.stack([ndimage.gaussian_filter(a[:,:,c], 2) for c in range(3)], axis=2)
noise_std = (a[ring]-blur[ring]).std(axis=0)
print('noise std:', noise_std.round(2))
rng = np.random.default_rng(7)
npx = int(hole.sum())
for c in range(3):
    ch=clean[:,:,c]
    ch[hole] = ch[hole] + rng.normal(0, noise_std[c]*0.9, npx)

Image.fromarray(np.clip(clean,0,255).astype(np.uint8)).save('image/foot3_clean.webp', 'WEBP', quality=90, method=6)
print('foot3_clean.webp bytes:', os.path.getsize('image/foot3_clean.webp'))

# ---------- 3) edge slices for letterbox fill ----------
im.crop((0, 0, 4, H)).save('image/edge_left.png')
im.crop((W-4, 0, W, H)).save('image/edge_right.png')
im.crop((0, 0, W, 4)).save('image/edge_top.png')
im.crop((0, H-4, W, H)).save('image/edge_bottom.png')
for name, arr2 in [('left', a[:, :2]), ('right', a[:, -2:]), ('top', a[:2, :]), ('bottom', a[-2:, :])]:
    print('edge', name, 'avg RGB', arr2.reshape(-1,3).mean(axis=0).round(0))
