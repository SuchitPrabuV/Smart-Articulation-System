# Smart Articulation Training System

A clinical-grade therapy practice tool designed to help learners master speech articulation between sessions. The system provides an interactive 3D avatar showing target mouth/tongue positions, captures user speech audio, and performs phoneme-level scoring and confusion-targeted clinical feedback.

## 1. Repository & Branch Model

We follow a strict branch and lane model to prevent merge conflicts during development:
- **`main`**: Protected branch. Only Suchit merges. Always kept in a demoable state.
- **`feat/frontend`**: Shivani's development branch.
- **`feat/animation`**: Tanisha's development branch.
- **`feat/scoring`**: Sukirthan's development branch.

### Daily Workflow
* Pull latest changes and rebase daily:
  ```bash
  git checkout feat/<your-branch>
  git fetch origin
  git rebase origin/main
  ```
* Standardized Commit Message Prefixes: `[frontend]`, `[animation]`, `[scoring]`, `[lead]`.
* **`contracts/`** is read-only for feature developers. Request changes via Suchit.

---

## 2. Directory Structure

```
smart-articulation/
├── README.md                      # SUCHIT (Lead)
├── .gitignore                     # SUCHIT
├── contracts/                     # SUCHIT (Read-only for others)
│   ├── CONTRACT.md                # The API & naming specification
│   ├── phonemes.json              # Viseme & clinical cue table
│   └── content.json               # Therapy target hierarchy
│
├── frontend/                      # React + Vite + Tailwind
│   ├── package.json               # Package dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── index.html                 # Main entry point
│   ├── public/
│   │   ├── models/avatar.glb      # 3D Avatar assets (TANISHA)
│   │   └── clips/                 # Pre-rendered video fallbacks (TANISHA)
│   └── src/
│       ├── main.jsx               # Router entry (SUCHIT)
│       ├── App.jsx                # Layout Shell (SHIVANI)
│       ├── index.css              # Styling & Design Tokens (SUCHIT)
│       ├── api/client.js          # Backend API Client (SHIVANI)
│       ├── data/loadContent.js    # Local JSON content loader (SHIVANI)
│       ├── hooks/useRecorder.js   # Browser recorder hook (SHIVANI)
│       ├── pages/                 # UI Pages (SHIVANI)
│       │   ├── Home.jsx
│       │   ├── Practice.jsx
│       │   └── Progress.jsx
│       ├── components/            # UI Components (SHIVANI, except Articulation.jsx)
│       │   ├── Layout.jsx
│       │   ├── PhonemeCard.jsx
│       │   ├── RecordButton.jsx
│       │   ├── FeedbackPanel.jsx
│       │   ├── LevelTabs.jsx
│       │   └── Articulation.jsx   # 3D Canvas / Video wrapper (TANISHA)
│       └── animation/             # 3D Rig & Timeline Logic (TANISHA)
│
└── backend/                       # Python Backend (SUKIRTHAN)
    ├── requirements.txt
    ├── main.py
    └── scoring/                   # scoring engines & feedback modules
```

---

## 3. Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies and start the backend:
   ```bash
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```