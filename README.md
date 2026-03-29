# jnewton.pro

Personal portfolio and project showcase for Jeff Newton — AI Business Analyst, Product Owner, Cloud Engineer.

**Live site:** [jnewton.pro](https://jnewton.pro)

---

## Stack

Plain HTML/CSS/JS. No build step. No framework. Hosted on GitHub Pages with a custom domain.

---

## Folder Structure

```
jnewton-pro/
├── index.html                        # Main portfolio page
├── projects/
│   ├── index.html                    # Auto-lists all projects from data/projects.json
│   ├── _template.html                # Copy this to add a new project page
│   ├── ai-ba-toolkit.html            # AI BA Toolkit project page
│   ├── social-media-tool.html        # Social Media Content Tool page (add when ready)
│   └── mortgage-portal-automation.html  # Mortgage Portal page (add when ready)
├── data/
│   └── projects.json                 # Project list — edit this to add/remove projects
└── README.md
```

---

## Setup: GitHub Pages with Custom Domain

### 1. Create the repo

1. Go to [github.com/new](https://github.com/new)
2. Name it `jnewton-pro` (or anything you like)
3. Set it to **Public**
4. Do NOT initialize with a README (you already have files)

### 2. Push your files

```bash
cd jnewton-pro
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/JNewton86/jnewton-pro.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Click **Save**

GitHub will give you a URL like `https://jnewton86.github.io/jnewton-pro`

### 4. Connect your custom domain (jnewton.pro)

**In GitHub:**
1. Settings → Pages → Custom domain
2. Type `jnewton.pro` and click Save
3. Check "Enforce HTTPS" once DNS is confirmed

**In GoDaddy (or wherever your domain lives):**

Add these DNS records:

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | jnewton86.github.io    |

DNS changes can take up to 24 hours to propagate. Once done, jnewton.pro will load your GitHub Pages site.

**Important:** You can keep your domain at GoDaddy and just stop paying for the Website Builder. The domain registration is a separate charge from the website builder subscription.

---

## Adding a New Project

### Step 1: Add an entry to `data/projects.json`

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "tagline": "One sentence describing what it does.",
  "tags": ["React", "AWS", "Claude API"],
  "status": "live",
  "category": "AI / Product",
  "url": "/projects/my-new-project.html",
  "featured": false
}
```

Status options: `"live"`, `"wip"`, `"concept"`

### Step 2: Copy the template

```bash
cp projects/_template.html projects/my-new-project.html
```

Then open the file and fill in every section marked `TODO`.

### Step 3: Push

```bash
git add .
git commit -m "Add my-new-project"
git push
```

That's it. It's live at `jnewton.pro/projects/my-new-project` within about 60 seconds.

---

## Updating Content on the Main Page

All content is in `index.html`. Open it in any text editor, make your changes, and push.

The sections are clearly commented. Search for the text you want to change — it's plain HTML.

---

## Contact Form

The contact form in `index.html` doesn't actually send emails yet. To wire it up:

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — it gives you an endpoint like `https://formspree.io/f/xyzabcde`
3. In `index.html`, find the `handleSend()` function and replace it with a fetch POST to that URL

Free tier: 50 submissions/month. More than enough for a portfolio.

---

## Email (keeping jeff@jnewton.pro without GoDaddy)

Once you cancel the GoDaddy website builder, keep the domain but set up free email forwarding:

**Option A: Cloudflare Email Routing (free, receive only)**
- Move DNS to Cloudflare (free)
- Enable Email Routing → forwards jeff@jnewton.pro to your Gmail

**Option B: Zoho Mail (free, send and receive as jeff@jnewton.pro)**
- Sign up at [zoho.com/mail](https://zoho.com/mail) — free for 1 user
- Follow their DNS setup (adds MX records to your domain)
- You'll be able to send AND receive as jeff@jnewton.pro

Zoho is the better option if you're using this email professionally in job applications.
