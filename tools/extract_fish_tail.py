"""Extract the caudal region of museum specimen P 443, without posing its bones.

Usage: python tools/extract_fish_tail.py original.stl output-directory
Then: node tools/build_fish_tail.mjs output-directory
Source and derivative license: models/fish-tail-license.txt
"""
import hashlib
import json
import pathlib
import sys

import numpy as np

source, output = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
with source.open('rb') as stream:
    assert hashlib.file_digest(stream, 'sha1').hexdigest() == '6f78d2d7bd7ffcfc53e97e8b6c8a4b6f119b0eba', 'Unexpected source scan'
count = int.from_bytes(source.read_bytes()[80:84], 'little')
facets = np.memmap(source, mode='r', offset=84, shape=(count,), dtype=np.dtype([
    ('normal', '<f4', (3,)), ('vertices', '<f4', (3, 3)), ('attribute', '<u2')]))
origin = np.array([-3.5987508296966553, 12.550492286682129, 20.036691665649414])
# A single orthonormal change of basis aligns the scanned fish's long axis.
basis = np.array([
    [-.5920274236486249, -.15446401390817652, .7909768631605774],
    [.7884238448022857, .0923779555283669, .6081563567698528],
    [.1670070974394592, -.9836702606767036, -.06709282871569196]])
if np.linalg.det(basis) < 0:
    basis[:, 2] *= -1
centres = (facets['vertices'].mean(axis=1) - origin) @ basis
# Cut behind the dorsal/anal fins. Exclude the thin museum support wire
# above the narrow proximal tail, rather than incorporating it as anatomy.
keep = (centres[:, 0] >= 125) & ((centres[:, 0] >= 140) | (centres[:, 1] < -10))
triangles = (facets['vertices'][keep] - origin) @ basis
vertices, indices = np.unique(triangles.reshape(-1, 3).astype('<f4'), axis=0, return_inverse=True)
proximal = vertices[vertices[:, 0] < 127]
join = proximal.mean(axis=0)
length = vertices[:, 0].max() - join[0]
# Uniform scale only: preserve the scanned fork, rays and asymmetry.
q = (vertices - join) * (2.8 / length)
positions = np.column_stack((q[:, 1], -q[:, 0], q[:, 2])).astype('<f4')
output.mkdir(parents=True, exist_ok=True)
positions.tofile(output / 'positions.bin')
indices.astype('<u4').tofile(output / 'indices.bin')
(output / 'extraction.json').write_text(json.dumps({
    'sourceTriangles': count, 'extractedTriangles': len(indices) // 3,
    'vertices': len(vertices), 'sourceSHA1': '6f78d2d7bd7ffcfc53e97e8b6c8a4b6f119b0eba',
    'join': join.tolist(), 'uniformScale': float(2.8 / length),
}), encoding='utf8')
print('Extracted', len(indices) // 3, 'triangles; bounds:', positions.min(0), positions.max(0))
