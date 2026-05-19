module.exports = function (eleventyConfig) {
  // Pass assets through unchanged
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Format a date string as "12 January 2024"
  eleventyConfig.addFilter("readableDate", (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Slice an array to a maximum length
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Filter array by a property value
  eleventyConfig.addFilter("where", (arr, key, val) =>
    arr.filter((item) => item[key] === val)
  );

  // Serialize a value to JSON (used to pass data to JS)
  eleventyConfig.addFilter("jsonify", (val) => JSON.stringify(val));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
