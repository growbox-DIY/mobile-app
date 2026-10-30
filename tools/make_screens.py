# make_screens.py - lays the simulator screenshots from screenshots/ out
# into screenshots/screens.png and screenshots/screens-more.png
# (run on a Mac, needs Pillow):
#   python3 tools/make_screens.py
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "screenshots")
FONT = "/System/Library/Fonts/SFNS.ttf"

K = 2  # drawn at 2x, scaled down for smooth edges
W = 1500  # final width
PAD = 60
GAP = 40

BG = "#011515"
TEXT = "#F2F5F4"
DIM = "#8A9B9B"
EDGE = "#123333"
GREEN = "#00E95A"
CYAN = "#20DCE8"

TITLE = "GrowBox app"
SUBTITLE = "Live climate · light schedule · fan & humidifier · watering log"
NOTE = "Expo / React Native, talks to the ESP32 controller over the home WiFi. No cloud, no account."

# name: (columns, [(file, name, caption line 1, caption line 2)])
PAGES = {
    "screens.png": (4, [
        ("home-auto.png", "Home · Auto",
         "Flowering: climate, 24 h chart,",
         "week, fan, humidifier, nutrients"),
        ("home-manual.png", "Home · Manual",
         "Veg: chart against the veg ranges,",
         "fan, humidifier band, nutrients"),
        ("chart-7days.png", "7-day chart",
         "Tap the chart for the last 7 days,",
         "green bars mark each watering"),
        ("scheduler.png", "Scheduler",
         "Light on and off times",
         "for the Auto (flowering) mode"),
        ("settings-manual.png", "Settings · Manual",
         "Light and fan switches, Auto fan,",
         "day fan level, display and monitor"),
        ("settings-auto.png", "Settings · Auto",
         "Flowering start, fan speed,",
         "night fan and night dimmer"),
        ("feed-me-now.png", "Feed me now",
         "Day 4 without watering: the card",
         "turns red, alerts every 2 h"),
        ("offline.png", "Offline",
         "The controller doesn't answer:",
         "reload, or wait for the auto retry"),
    ]),
    "screens-more.png": (3, [
        ("settings-manual-2.png", "Settings · Manual",
         "Scrolled down: display, monitor",
         "and monitor brightness"),
        ("settings-auto-2.png", "Settings · Auto",
         "Scrolled down: night dimmer,",
         "display, monitor and brightness"),
        ("scheduler-change.png", "Change time",
         "Type the new on or off time",
         "and save it to the controller"),
        ("settings-manual-autofan.png", "Auto fan",
         "The controller sets the fan speed",
         "from the temperature"),
        ("feed-late.png", "Day 3 reminder",
         "Third day without watering:",
         "the feeding card turns yellow"),
    ]),
}

_fonts = {}


def font(size, weight="Regular"):
    key = (size, weight)

    if key not in _fonts:
        f = ImageFont.truetype(FONT, size * K)
        f.set_variation_by_name(weight)
        _fonts[key] = f

    return _fonts[key]


def s(*v):
    return [round(x * K) for x in v]


def corner_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def render(name, cols, screens):
    col_w = (W - 2 * PAD - (cols - 1) * GAP) / cols
    shot_w = col_w - 2 * 9  # 6 px gap + 3 px frame on each side
    first = Image.open(os.path.join(ROOT, screens[0][0]))
    shot_h = shot_w * first.height / first.width

    header_h = 190
    cell_h = 40 + shot_h + 18 + 70
    rows = (len(screens) + cols - 1) // cols
    H = round(header_h + rows * cell_h + (rows - 1) * GAP + PAD)

    img = Image.new("RGB", (W * K, H * K), BG)
    d = ImageDraw.Draw(img)

    d.text(s(PAD, 52), TITLE, font=font(40, "Bold"), fill=TEXT)
    d.text(s(PAD, 106), SUBTITLE, font=font(22, "Medium"), fill=CYAN)
    d.text(s(PAD, 142), NOTE, font=font(17), fill=DIM)

    for i, (file, title, line1, line2) in enumerate(screens):
        row, col = divmod(i, cols)
        # a short last row is centred
        in_row = min(cols, len(screens) - row * cols)
        x0 = PAD + (W - 2 * PAD - in_row * col_w - (in_row - 1) * GAP) / 2 + col * (col_w + GAP)
        y0 = header_h + row * (cell_h + GAP)
        cx = x0 + col_w / 2

        d.text(s(cx, y0), title, font=font(22, "Bold"), fill=GREEN, anchor="ma")

        fy = y0 + 40
        d.rounded_rectangle(s(x0, fy, x0 + col_w, fy + shot_h + 18), radius=round(shot_w * 0.14 * K) + 9 * K,
                            outline=EDGE, width=3 * K)
        shot = Image.open(os.path.join(ROOT, file)).convert("RGB")
        shot = shot.resize(s(shot_w, shot_h), Image.LANCZOS)
        img.paste(shot, s(x0 + 9, fy + 9), corner_mask(shot.size, round(shot_w * 0.14 * K)))

        ty = fy + shot_h + 18 + 16
        d.text(s(cx, ty), line1, font=font(16, "Medium"), fill=TEXT, anchor="ma")
        d.text(s(cx, ty + 24), line2, font=font(16), fill=DIM, anchor="ma")

    img.resize((W, H), Image.LANCZOS).save(os.path.join(ROOT, name), optimize=True)
    print(name, W, H)


for name, (cols, screens) in PAGES.items():
    render(name, cols, screens)
