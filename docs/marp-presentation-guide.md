# Marp Presentation Guide — From Prompt to Google Slides

A step-by-step guide for creating dark-themed Marp presentations with consistent styling, keyword-driven content, and proper footer spacing. Based on lessons learned from the **Agentic AI Protocols** slide deck.

---

## Table of Contents

1. [From Prompt to the `.md` File](#1-from-prompt-to-the-md-file)
2. [Consistent Content with Spacious Footer](#2-consistent-content-with-spacious-footer)
3. [Consistent Contrast & Color System](#3-consistent-contrast--color-system)
4. [Keyword-Only Slide Content](#4-keyword-only-slide-content)
5. [Prompt to Generate the `.md` File](#5-prompt-to-generate-the-md-file)
6. [Converting to PPTX & Importing to Google Slides](#6-converting-to-pptx--importing-to-google-slides)

---

## 1. From Prompt to the `.md` File

### Workflow

1. **Write your topic outline first** — List slide titles + 2-3 bullet points per slide in plain text
2. **Create the `.md` file** with Marp YAML frontmatter at the top (see [Section 5](#5-prompt-to-generate-the-md-file) for the prompt)
3. **Separate slides** with `---` on its own line
4. **Use `<!-- _class: lead -->` before section divider slides** (title-only, centered)
5. **Put detailed talking points in `<!-- Speaker notes: -->` blocks** — never on the slide itself

### File Structure Pattern

```markdown
---
marp: true
theme: default
paginate: true
backgroundColor: #0f0f23
color: #eaeaea
style: |
  section {
    font-family: 'Inter', 'SF Pro Display', sans-serif;
    padding: 50px 60px 80px 60px;
  }
  h1 { color: #00d4aa; font-size: 2.2em; }
  h2 { color: #00d4aa; font-size: 1.8em; }
  h3 { color: #7b68ee; }
  strong { color: #00d4aa; }
  code { background: #2d2d44; color: #ff6b6b; }
  table { font-size: 0.75em; background: #1a1a3e; }
  th { color: #00d4aa !important; background: #1a1a3e !important; border-color: #3d3d5c !important; }
  td { color: #eaeaea !important; background: #1a1a3e !important; border-color: #3d3d5c !important; }
  blockquote { border-left: 4px solid #00d4aa; background: #2d2d44; padding: 0.5em 1em; }
  em { color: #ffd93d; font-style: normal; }
---

<!-- _class: lead -->

# Title Slide

---

# Content Slide 1

(visible keyword content)

<!-- Speaker notes: detailed explanation goes here -->

---

# Content Slide 2

(visible keyword content)

<!-- Speaker notes: detailed explanation goes here -->
```

### Key Rules

- Every slide starts after a `---` separator
- Section dividers (e.g., "Protocol 1", "Key Takeaways") use `<!-- _class: lead -->` on the line before the slide content — this centers everything
- Speaker notes go at the **bottom** of each slide, before the next `---`
- The YAML frontmatter + CSS block is only at the very top of the file

---

## 2. Consistent Content with Spacious Footer

Marp slides have a **fixed height of ~720px**. The page number renders at the bottom. If your content exceeds the available height, it gets **cut off with no warning**.

### The Golden Rule

```css
section {
  padding: 50px 60px 80px 60px; /* top right BOTTOM left */
}
```

The `80px` bottom padding reserves space for the page number. Your visible content must fit within **~590px of usable height**.

### Content Height Budget

| Element                                                      | Approximate Height |
| ------------------------------------------------------------ | ------------------ |
| `# H1` title                                                 | ~80px              |
| `## H2` subtitle                                             | ~60px              |
| `### H3` subheader                                           | ~40px              |
| One list item (single line)                                  | ~35px              |
| One list item with `` `inline code` `` (may wrap to 2 lines) | ~50-60px           |
| Table header row                                             | ~35px              |
| Table data row                                               | ~30px              |
| Code block line                                              | ~22px              |
| `<br>` spacer                                                | ~20px              |
| Blockquote (1-2 lines)                                       | ~50px              |

### Safe Combinations (Tested)

| Layout                                                 | Fits?                     |
| ------------------------------------------------------ | ------------------------- |
| H1 + 6 short list items + 6-line code block            | ✅ Yes                    |
| H1 + 4-row table + 3 bullets                           | ✅ Yes                    |
| H1 + 5-row table + 3 bullets                           | ✅ Tight but OK           |
| H1 + H3 + 5-row table + 3 bullets                      | ⚠️ Borderline — remove H3 |
| H1 + 6 list items with inline code + 8-line code block | ❌ Overflows              |
| H1 + H3 + 6 list items + 7-line code block             | ❌ Overflows              |

### Rules to Prevent Cutoff

1. **Never** combine `### Subheader` + 6 list items + code block on one slide
2. Keep code blocks to **6-7 lines max**
3. If list items contain `` `inline code` ``, they may wrap — budget each as ~50px instead of ~35px
4. Keep tables to **4-5 data rows** when combined with other content
5. Test in **Marp Preview** (VS Code extension) after every slide edit
6. If a slide is borderline, remove the `### H3` subheader first — it saves ~40px
7. Use `<br>` for intentional vertical spacing, not empty lines

### Emergency Fixes for Overflowing Slides

If content still overflows after trimming:

1. **Remove the H3 subheader** — saves ~40px
2. **Reduce table rows** — drop the least important row
3. **Shorten list item text** — remove parenthetical "(Python)" or "(TypeScript)"
4. **Split into two slides** — "Building X" + "X — Code Example"
5. **Use per-slide font override** (last resort):
   ```markdown
   <!-- _style: "font-size: 0.85em" -->
   ```

---

## 3. Consistent Contrast & Color System

### The 4-Color Hierarchy

Our dark theme uses a strict color hierarchy against the `#0f0f23` background:

| Role                 | Color        | Hex       | CSS Target                      | Used For                                            |
| -------------------- | ------------ | --------- | ------------------------------- | --------------------------------------------------- |
| **Primary accent**   | Teal         | `#00d4aa` | `h1`, `h2`, `strong`, `th`      | Titles, bold text, table headers, blockquote border |
| **Secondary accent** | Purple       | `#7b68ee` | `h3`                            | Subheaders only                                     |
| **Body text**        | Light gray   | `#eaeaea` | `p`, `li`, `td`, `blockquote p` | All readable content                                |
| **Highlight**        | Yellow       | `#ffd93d` | `em`                            | Emphasis keywords (rendered non-italic)             |
| **Inline code**      | Red          | `#ff6b6b` | `code`                          | Code snippets on `#2d2d44` chip                     |
| **Surface**          | Dark navy    | `#1a1a3e` | `table`, `th`, `td`             | Table backgrounds                                   |
| **Code surface**     | Dark purple  | `#2d2d44` | `code`, `blockquote`            | Code chip + blockquote fill                         |
| **Borders**          | Muted purple | `#3d3d5c` | `th`, `td` borders              | Table borders only                                  |

### Contrast Ratios (All Pass WCAG AA)

| Foreground                   | Background               | Ratio      | Rating    |
| ---------------------------- | ------------------------ | ---------- | --------- |
| `#eaeaea` (body text)        | `#0f0f23` (background)   | **14.5:1** | Excellent |
| `#00d4aa` (teal accent)      | `#0f0f23` (background)   | **9.8:1**  | Excellent |
| `#ffd93d` (yellow highlight) | `#0f0f23` (background)   | **12.1:1** | Excellent |
| `#ff6b6b` (code red)         | `#2d2d44` (code surface) | **4.6:1**  | Passes AA |
| `#7b68ee` (purple H3)        | `#0f0f23` (background)   | **5.2:1**  | Passes AA |

### Critical CSS Notes

- Tables **require `!important`** on `color`, `background`, and `border-color` for `th` and `td` — Marp's default theme aggressively overrides them
- `em` (italic) is **repurposed as a yellow highlighter** via `font-style: normal` — use `*text*` for emphasis, not actual italics
- `blockquote` uses teal left-border (`#00d4aa`) + dark surface fill (`#2d2d44`) for callouts
- `strong` (bold `**text**`) renders in teal — use it for key terms the audience should notice

### Complete CSS Block (Copy-Paste Ready)

```css
section {
  font-family: "Inter", "SF Pro Display", sans-serif;
  padding: 50px 60px 80px 60px;
}
h1 {
  color: #00d4aa;
  font-size: 2.2em;
}
h2 {
  color: #00d4aa;
  font-size: 1.8em;
}
h3 {
  color: #7b68ee;
}
strong {
  color: #00d4aa;
}
code {
  background: #2d2d44;
  color: #ff6b6b;
}
table {
  font-size: 0.75em;
  background: #1a1a3e;
  border-collapse: collapse;
  width: auto;
}
th {
  color: #00d4aa !important;
  background: #1a1a3e !important;
  border-color: #3d3d5c !important;
}
td {
  color: #eaeaea !important;
  background: #1a1a3e !important;
  border-color: #3d3d5c !important;
}
li,
p {
  color: #eaeaea;
}
blockquote {
  border-left: 4px solid #00d4aa;
  background: #2d2d44;
  padding: 0.5em 1em;
}
blockquote p {
  color: #eaeaea;
}
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
}
em {
  color: #ffd93d;
  font-style: normal;
}
```

---

## 4. Keyword-Only Slide Content

### The Principle

Slides are **visual anchors**, not scripts. Every word on screen should be a keyword or phrase the audience remembers. All detail lives in speaker notes.

### Transformation Examples

| Instead of...                                                                 | Use...                                                      |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
| "The Model Context Protocol allows LLMs to connect to tools and data sources" | `MCP = LLM ↔ Tools/Data`                                    |
| "Install the SDK using pip install a2a-sdk for Python or npm for JavaScript"  | `**Install** — \`pip install a2a-sdk\` or \`npm i a2a-js\`` |
| Full sentences in table cells                                                 | 3-5 word fragments                                          |
| Paragraphs explaining concepts                                                | Tables: `Concept \| One-liner`                              |
| Step-by-step paragraphs                                                       | Numbered bold-keyword lists                                 |

### Slide Layout Patterns

**Pattern 1: Numbered Steps**

```markdown
# Building an MCP Server

1. **Install** — `uv add "mcp[cli]"` or `npm i @modelcontextprotocol/sdk`
2. **Init** — `mcp = FastMCP("my-server")`
3. **Define tools** — `@mcp.tool()` with typed args + docstrings
4. **Run** — `mcp.run(transport="stdio")` or Streamable HTTP
```

**Pattern 2: Comparison Table**

```markdown
# MCP vs A2A

|           |  **MCP**  |      **A2A**       |
| --------- | :-------: | :----------------: |
| Caller    |    LLM    | Another **agent**  |
| State     | Stateless | Per-task lifecycle |
| Streaming |   Rare    | First-class (SSE)  |

> **Heuristic:** Does the callee have its own LLM? → **A2A**
```

**Pattern 3: Concept Grid**

```markdown
# Key Concepts

|      Concept      | What it is                        |
| :---------------: | --------------------------------- |
| 🪪 **Agent Card** | JSON identity + skills            |
|   🎯 **Skill**    | Capability tag                    |
|    📋 **Task**    | `submitted → working → completed` |
```

**Pattern 4: Do / Don't**

```markdown
# Best Practices

### ✅ Do:

| Practice                   | Why                |
| -------------------------- | ------------------ |
| **Validate inputs**        | Prevents injection |
| **Return structured JSON** | Easier for LLM     |

### ❌ Don't:

- Don't put LLM calls inside MCP (use A2A)
- Don't expose >20 tools
```

### Content Rules

| Rule                 | Limit                            |
| -------------------- | -------------------------------- |
| List items per slide | **Max 6**                        |
| Words per table cell | **Max 5**                        |
| Code block lines     | **Max 6-7**                      |
| Table data rows      | **Max 4-5** (with other content) |
| Blockquote per slide | **Max 1**                        |
| Emoji per slide      | **Max 2-3** (for visual anchors) |

### Where Detail Goes

```markdown
# Visible Slide (keywords only)

1. **Install** — `pip install a2a-sdk`
2. **Define Skills** — `AgentSkill(id, name, tags)`
3. **Create Agent Card** — identity + endpoint

<!-- Speaker notes:
Step 1 — Install the official SDK. The A2A Python SDK is at
github.com/a2aproject/a2a-python. For JavaScript: npm i a2a-js.
Official SDKs also exist in Java, C#/.NET, and Go.

Step 2 — Define Skills. Each skill has an id (unique identifier),
name (human-readable), description (what it does), tags (for
categorization and discovery), and examples (sample prompts).

Step 3 — Create the Agent Card. This is your agent's "business card"
— a JSON document that declares identity, version, capabilities,
supported interfaces, and the list of skills.
-->
```

---

## 5. Prompt to Generate the `.md` File

Copy this prompt into your AI tool. Replace `[TOPIC]`, `[TEAM]`, `[DATE]`, and `[OUTLINE]`.

---

```
Create a Marp presentation in a single .md file about [TOPIC] for [TEAM] — [DATE].

FORMAT REQUIREMENTS:
- YAML frontmatter: marp: true, theme: default, paginate: true
- Dark theme: backgroundColor #0f0f23, color #eaeaea
- CSS section padding: 50px 60px 80px 60px (80px bottom for page numbers)
- Color system:
  - h1/h2/strong: #00d4aa (teal)
  - h3: #7b68ee (purple)
  - code: #ff6b6b on #2d2d44 background
  - em: #ffd93d with font-style: normal (yellow highlighter, not italic)
  - table: #1a1a3e background, #3d3d5c borders
  - blockquote: border-left #00d4aa, background #2d2d44
- All table th/td colors MUST use !important to override Marp defaults

SLIDE CONTENT RULES:
- Each slide separated by ---
- Section dividers use <!-- _class: lead --> (centered, title-only)
- KEYWORD-ONLY visible content — no full sentences on slides
- Max 6 list items per slide
- Max 5 words per table cell
- Code blocks max 6-7 lines
- Tables max 4-5 data rows when combined with other content
- Total visible content must fit within ~590px height:
  - H1 = ~80px, list item = ~35px (50px if has inline code)
  - Code line = ~22px, table row = ~30px, H3 = ~40px
- Use numbered bold-keyword format: "1. **Keyword** — short phrase"
- One blockquote per slide max for the key takeaway
- Use <br> for spacing, emoji sparingly for visual anchors

SPEAKER NOTES:
- EVERY slide must have <!-- Speaker notes: ... --> with full talking points
- Speaker notes contain ALL detail, context, examples, and explanations
- Notes should be 100-300 words per slide — this is the presenter's script
- Notes go at the bottom of each slide, before the next ---

SLIDE STRUCTURE:
1. Title slide (lead class) — topic, subtitle, team name, date
2. Problem statement — what pain are we solving?
3. [OUTLINE — LIST YOUR SPECIFIC SLIDES HERE]
4. Key takeaways — 3-4 numbered memorable points
5. Questions slide — resource links
6. Closing slide (lead class) — inspirational quote as blockquote

Generate the complete .md file now.
```

---

### Example Usage

```
Create a Marp presentation in a single .md file about "Kubernetes Cost
Optimization" for Core Infrastructure Team — May 2026.

[... format requirements as above ...]

SLIDE STRUCTURE:
1. Title slide
2. Problem — current cloud spend breakdown
3. The 3 Pillars: Right-sizing, Spot instances, Autoscaling
4. Right-sizing deep dive — tools and process
5. Spot instances — when safe vs risky
6. HPA + VPA autoscaling patterns
7. Our results — before/after metrics
8. Key takeaways
9. Questions
10. Closing quote
```

---

## 6. Converting to PPTX & Importing to Google Slides

### Option A: Marp CLI (Recommended)

**Step 1 — Install Marp CLI:**

```bash
npm install -g @marp-team/marp-cli
```

**Step 2 — Export to PPTX:**

```bash
marp --pptx your-presentation.md -o presentation.pptx
```

**Step 3 — Import to Google Slides:**

1. Go to [slides.google.com](https://slides.google.com)
2. Click **Blank presentation**
3. Go to **File → Import slides**
4. Click the **Upload** tab
5. Drag your `presentation.pptx` file
6. Select **All slides** → click **Import slides**

### Option B: Export as PDF (Higher Visual Fidelity)

```bash
marp --pdf your-presentation.md -o presentation.pdf
```

Then convert PDF → PPTX using:

- [CloudConvert](https://cloudconvert.com/pdf-to-pptx)
- Adobe Acrobat → Export → PowerPoint

Import the resulting `.pptx` to Google Slides per Step 3 above. This preserves visual fidelity better but slides are image-based (not editable text).

### Option C: VS Code Marp Extension

1. Install the **"Marp for VS Code"** extension
2. Open your `.md` file
3. Click the **Marp icon** (triangle) in the editor title bar
4. Select **Export Slide Deck**
5. Choose **PPTX** format
6. Import to Google Slides per Step 3

### Option D: Export as HTML (For Web Sharing)

```bash
marp your-presentation.md -o presentation.html
```

Open `presentation.html` in any browser. Use arrow keys to navigate. Good for sharing via URL without Google Slides.

### Important Notes

| Topic                 | Detail                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| **Text editability**  | PPTX export renders slides as images — text is NOT editable in Google Slides or PowerPoint      |
| **Speaker notes**     | Speaker notes ARE included in the PPTX and visible in Presenter View                            |
| **Source of truth**   | Always keep the `.md` file as your canonical version — re-export when you make changes          |
| **Aspect ratio**      | Marp defaults to 16:9 (1280×720). Google Slides uses 16:9 by default — they match               |
| **Custom fonts**      | If using custom fonts (Inter, SF Pro), ensure they're installed on the machine running Marp CLI |
| **Chrome dependency** | Marp CLI uses Chromium for rendering. On first run it may download Chromium (~150MB)            |

### Quick Reference Commands

```bash
# Install Marp CLI
npm install -g @marp-team/marp-cli

# Export to PPTX
marp --pptx presentation.md -o output.pptx

# Export to PDF
marp --pdf presentation.md -o output.pdf

# Export to HTML
marp presentation.md -o output.html

# Preview in browser (live reload)
marp --preview presentation.md

# Export with custom theme
marp --theme custom-theme.css --pptx presentation.md -o output.pptx
```

---

## Quick Checklist Before Exporting

- [ ] Every slide has `<!-- Speaker notes: -->` with 100-300 words
- [ ] No slide has content exceeding ~590px visible height
- [ ] Page numbers are visible on every slide (not cut off)
- [ ] All tables use `!important` on colors in the CSS
- [ ] Code blocks are max 6-7 lines
- [ ] Tables are max 4-5 data rows (with other content)
- [ ] No full sentences on slide faces — keywords only
- [ ] Section dividers use `<!-- _class: lead -->`
- [ ] Tested in Marp Preview (VS Code) or `marp --preview`
