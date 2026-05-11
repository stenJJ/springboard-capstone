function normalizeUrl(url) {
  try {
    const parsed = new URL(url);

    parsed.hash = "";

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/watch?v=${parsed.pathname.slice(1)}`;
    }

    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("t");

    return parsed.toString();
  } catch {
    return null;
  }
}

module.exports = normalizeUrl;