#!/bin/sh
# Prepare the source footage: upscale 464x832 -> 1080x1920 (lanczos + light sharpen/grade),
# clean voice (high-pass, denoise, gentle compression) and normalise to -14 LUFS.
# Usage: scripts/prepare.sh "riki tiktok 28102026.mp4"
set -e
ffmpeg -y -i "$1" \
  -vf "scale=1080:1920:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,eq=contrast=1.04:saturation=1.06" \
  -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p \
  -af "highpass=f=80,afftdn=nf=-25,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-14:TP=-1.5:LRA=9" \
  -ar 48000 -c:a aac -b:a 192k public/speaker.mp4
python3 scripts/make_sfx.py public/sfx
python3 scripts/face_track.py "$1" src/data/face.json
