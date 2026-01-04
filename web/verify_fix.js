const content = "The speaker highlights [516f84b0-2cd2-4f7c-8eb7-62ea59087922:9:27-14:14; 14:25-16:49].";
const role = "assistant";

// New implementation
function processContent(content) {
    if (role !== "assistant") return content;
    const citationRegex = /\[([a-zA-Z0-9_-]+):([^\]]+)\]/g;
    return content.replace(citationRegex, (match, id, ts) => {
        // ts might be "10:00", "10:00-12:00", or "9:27-14:14; 14:25-16:49"
        const startTs = ts.split(/[-;]/)[0].trim();
        return `__CITATION_START__[${ts}](citation:${id}:${startTs})__CITATION_END__`;
    });
}

const result = processContent(content);
console.log("Original:", content);
console.log("Processed:", result);

// Check if it created the correct link
if (result.includes("](citation:516f84b0-2cd2-4f7c-8eb7-62ea59087922:9:27)")) {
    console.log("SUCCESS: Link target is correct (9:27)");
} else {
    console.log("FAIL: Link target incorrect");
}
