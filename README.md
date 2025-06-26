## 🕷️ Wikipedia Spider Crawler
Author : Samir Khiri
Date : Wed Jun 25, 2025

A lightweight **Node.js script** that crawls Wikipedia articles starting from a user-specified page, exploring up to `n` link-depths (1–3), and writing all visited article URLs to a CSV file.

---

### 📌 Features

* ✅ Starts from any valid Wikipedia article
* ✅ Traverses up to 10 unique, valid article links per page
* ✅ Depth-limited crawl (user-specified: 1–3)
* ✅ Skips non-article links (e.g., File:, Talk:, Special:)
* ✅ Outputs visited pages to `visited_pages.csv`

---

### 🧰 Requirements

* Node.js v14+
* Internet connection

---

### 📦 Installation

```bash
git clone https://github.com/simiwoods99/wiki-spider.git
cd wiki-spider
npm install
```

---

### ▶️ Usage

```bash
node index.js
```

You will be prompted to:

* Enter a valid Wikipedia article URL (e.g. `https://en.wikipedia.org/wiki/Computer`)
* Enter crawl depth (1–3)

---

### 📝 Output

Creates a `visited_pages.csv` with this format:

```csv
Index,URL
1,"https://en.wikipedia.org/wiki/Computer"
2,"https://en.wikipedia.org/wiki/Technology"
3,"https://en.wikipedia.org/wiki/Science"
...
```

---

### 📒 Assumptions

* Only links within the **main content area** (`#bodyContent`) are crawled.
* Internal page anchors, media, and special pages are ignored.
* If fewer than 10 links are available, all valid ones are followed.

---

### 🧪 Example Run

```bash
Enter your wikipedia page of interest to spider! 🕷️ 
> https://en.wikipedia.org/wiki/Computer
Enter your desired depth (1-3): 
> 2
✅ Spider completed! CSV written to visited_pages.csv
```

