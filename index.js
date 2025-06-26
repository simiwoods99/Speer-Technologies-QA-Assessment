const { JSDOM } = require("jsdom");
const fs = require("fs");
const visited_pages = new Set();
const queue = [];
const prompt = require('prompt-sync')();
const readline = require('readline');



/**
 * Crawls Wikipedia pages starting from a given link, up to a specified n.
 * Fetches up to 10 unique links per page and writes visited URLs to a CSV.
 *
 * @param {string} link - The initial Wikipedia page URL to start crawling from.
 * @param {number} n - The n of crawl (how many link levels to follow).
 * @returns {Promise<void>} - A Promise that resolves when crawling and writing are complete.
 */
const spyder_wiki_pages = async (link, n) => {
    // Start by visiting current page and adding it to our queue
    queue.push({ link: link, n });

    // Repeat overall process while queue isn't empty -- ie We have more links to visit
    while (queue.length > 0) {
        // Deserialize our queue element
        const { link, n } = queue.shift();


        // Check if our current link exists in visited pages, if not add.
        if (visited_pages.has(link)) continue;
        visited_pages.add(link);
        // If we've reached the bottom level, go back up
        if (n === 0) continue;

        try {

            // Parse current wikipedia page
            const res = await fetch(link);
            const body = await res.text();
            const dom = new JSDOM(body);
            const document = dom.window.document;

            // Key assumption here , we really only care about the CONTENT in the article. From a business POV
            // This would make the most sense as to avoid nonsensical link traversal to wikipedias talk page , or their front page etc.
            // If you woul want ANY link as the requirement suggested , simply remove the filter block
            const rawLinks = [...document.querySelectorAll("#bodyContent a")]
                .map(a => a.href)
                .filter(href =>
                    href.startsWith("/wiki/") &&
                    !href.includes(":") &&
                    !href.includes("#") &&
                    !href.includes("cite_note")
                );

            /*
            Second assumption :
                1. There will be AT LEAST ten links.
                2. If NOT, then we will assume at most j links, where j > 10. 
                   And we go on accordingly travesing j links for the n+1 step instead of 10
            */
            let count = 0;
            for (const href of rawLinks) {
                const fullUrl = "https://en.wikipedia.org" + href;
                // Again only add if we haven't visited this page
                if (!visited_pages.has(fullUrl)) {
                    // Set n to the next level below, decrement until 0
                    queue.push({ link: fullUrl, n: n - 1 });
                    count++;
                    if (count >= 10) break; // Check if we've found 10 records (Main business condition)
                }
            }
        } catch (err) {
            console.error(`Error fetching ${link}: ${err.message}`);
        }
    }

    // Write to CSV
    const csvContent = Array.from(visited_pages)
        .map((url, index) => {
            //console.log(url, index)
            return `${index + 1},"${url}"`
        })
        .join("\n");


    fs.writeFileSync("visited_pages.csv", "Index,URL\n" + csvContent, "utf8");

};


/**
 * Crawls Wikipedia pages starting from a given link, up to a specified n.
 * Fetches up to 10 unique links per page and writes visited URLs to a CSV.
 *
 * @param {string} url - The initial Wikipedia page URL to start crawling from.
 * @returns {boolean} - Whether the wikiepdia article is properly formatted
 */const validateWikiArticle = (url) => {
    return (url.startsWith("https://en.wikipedia.org/wiki/") || url.startsWith("en.wikipedia.org/wiki/") || url.startsWith("http://en.wikipedia.org/wiki/"))
}
// Assumption : You can take user input , or we can just set it to the link , for simplicity
// the input method is commented out for now. But if you'd like to add this featureset simply uncomment the block


// Take user input 

let url = prompt("Enter your wikipedia page of interest to spider! 🕷️")

// Validate url structure.
if (!validateWikiArticle(url)) {
    console.error("Invalid Wikipedia URL, Please ensure:\n1.Contains [http(s)://]en.wikipedia.org/wiki/")
    return 0;
}

let depth = prompt("Enter your desired depth (1-3): ");

if (depth > 3 || depth < 1) {
    console.error("Invalid Depth Supplied Please ensure:\n1. Your value is between 1 and 3")
    return 0;
}
spyder_wiki_pages(url, depth); // Static call : Comment me. Try with n = 2 for a recursive crawl

