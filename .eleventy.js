const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("css"); // Copy `css/` to `_site/css`
	eleventyConfig.addPassthroughCopy("media"); // Copy `media/` to `_site/media`
	eleventyConfig.addPassthroughCopy("admin"); // Copy `admin/` to `_site/admin`
	eleventyConfig.addPassthroughCopy("variations"); // Copy `admin/` to `_site/admin`
	eleventyConfig.addPassthroughCopy("js"); // Copy `js/` to `_site/js`
	eleventyConfig.addPassthroughCopy("sitemap.xml");
	eleventyConfig.addPassthroughCopy("robots.txt");

	eleventyConfig.addFilter("postDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
	});

};
