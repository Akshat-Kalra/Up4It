# Up4It

> Spur-Of-The-Moment social discovery for UBC students – meet, hang out, and connect on the fly.

---

## 🚀 What Is It?

**Up4It** makes spontaneous hangouts visible *right now* — not buried in Facebook groups or forgotten GroupMe threads. It solves the “I’d go if I had someone to go with” problem by letting students create or join casual, short-notice meetups around campus.

---

## 🎯 The Core Itch It Scratches

UBC is a commuter-heavy campus. Social life feels fragmented. Up4It makes micro-hangouts visible in real time, helping students act on spontaneous plans without friction.

---

## 🧭 How It Works

| Step       | User Sees...                                                       | Behind the Scenes |
|------------|--------------------------------------------------------------------|-------------------|
| Open app   | Feed of events in the next 4 hours, sorted by distance.            | Old events pruned every 5 minutes. |
| Swipe      | Right = join, Left = skip, Up = “remind me later”.                | Firestore real-time listeners push updates. |
| Post       | Simple form: What + Where + When.                                 | Cloud Function adds expiry timestamp + geohash. |
| Meet-up    | Share-code confirms match (e.g., “blue-banana”).                   | No oversharing of personal info. |
| Auto-fade  | Cards disappear after 4h.                                          | Scheduled Cloud Tasks clean up and notify. |

---

## 🛡️ Safety & Trust Levers

- Campus-only email access.
- Karma score from peer feedback (thumbs up/down).
- Report/block features with moderation.
- Approximate location until matched.

---

## 📄 License

MIT – see `LICENSE.md`.

---

## 👥 Team

Built by students, for students. Made with ☕, React Native, and spontaneous energy.

- [Akshat](https://github.com/Akshat-Kalra)
- [Parth](https://github.com/parthkumar-patel)
