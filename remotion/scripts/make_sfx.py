"""Synthesize the light sound-design kit (whoosh, pop, click, impact) used by the edit."""
import numpy as np, wave, os, sys

SR = 48000
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/sfx"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def onepole_lp(x, cutoff):
    # time-varying one-pole lowpass; cutoff is an array in Hz
    y = np.zeros_like(x); a = np.exp(-2 * np.pi * cutoff / SR); s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y


def whoosh(dur=0.45):
    n = int(SR * dur); t = np.linspace(0, 1, n)
    env = np.sin(np.pi * t) ** 2.2
    cut = 300 + 5200 * np.sin(np.pi * t) ** 1.5
    lp = onepole_lp(rng.standard_normal(n), cut)
    hp = lp - onepole_lp(lp, np.full(n, 180.0))
    return hp * env


def pop(dur=0.09, f0=900, f1=420):
    n = int(SR * dur); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 45) * (1 - np.exp(-t * 2000))


def click(dur=0.035):
    n = int(SR * dur); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 260)
    noise = rng.standard_normal(n) * np.exp(-t * 700) * 0.4
    return tone + noise


def impact(dur=0.7):
    n = int(SR * dur); t = np.arange(n) / SR
    f = 46 + 70 * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    tr = onepole_lp(rng.standard_normal(n), np.full(n, 2500.0)) * np.exp(-t * 60) * 0.6
    return np.tanh((body + tr) * 1.6)


def riser(dur=0.6):
    n = int(SR * dur); t = np.linspace(0, 1, n)
    cut = 400 + 7000 * t ** 2
    x = onepole_lp(rng.standard_normal(n), cut)
    x = x - onepole_lp(x, np.full(n, 300.0))
    return x * t ** 1.6 * (1 - np.exp(-(1 - t) * 40))


save("whoosh.wav", whoosh(), 0.7)
save("whoosh-short.wav", whoosh(0.28), 0.6)
save("pop.wav", pop(), 0.6)
save("click.wav", click(), 0.5)
save("impact.wav", impact(), 0.85)
save("riser.wav", riser(), 0.5)
print("ok")
