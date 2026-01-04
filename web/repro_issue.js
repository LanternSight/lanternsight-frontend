const content = "The speaker highlights [516f84b0-2cd2-4f7c-8eb7-62ea59087922:9:27-14:14; 14:25-16:49].";
const role = "assistant";

// Current implementation
function processContent(content) {
    if (role !== "assistant") return content;
    // Current Regex
    const citationRegex = /\[([a-zA-Z0-9_-]+):((?:\d{1,2}:\d{2}(?::\d{2})?)(?:-\d{1,2}:\d{2}(?::\d{2})?)?)\]/g;
    return content.replace(citationRegex, (match, id, ts) => {
        const startTs = ts.split('-')[0];
        return `__CITATION_START__[${ts}](citation:${id}:${startTs})__CITATION_END__`;
    });
}

const result = processContent(content);
console.log("Original:", content);
console.log("Processed:", result);

if (result === content) {
    console.log("FAIL: Content was not processed (Regex missed the match)");
} else {
    console.log("SUCCESS: Content was processed");
}
