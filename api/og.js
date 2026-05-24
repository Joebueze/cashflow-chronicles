export default async function handler(req, res) {
  const { id } = req.query;

  const ua = req.headers['user-agent'] || '';
  const isCrawler = /flipboard|facebookexternalhit|twitterbot|googlebot|linkedinbot|whatsapp/i.test(ua);

  if (!id || !isCrawler) {
    return res.redirect(302, `https://www.cashflow-chronicle.com/post.html?id=${id || ''}`);
  }

  try {
    const url = `https://firestore.googleapis.com/v1/projects/cashflow-chronicles/databases/(default)/documents/posts/${id}?key=AIzaSyDzQNQUd5ppfjib6TE0M_New44Hp0uvuP8`;
    const response = await fetch(url);
    const data = await response.json();
    const fields = data.fields || {};

    const title = (fields.title?.stringValue || 'CashFlow Chronicle') + ' — CashFlow Chronicle';
    const desc = (fields.excerpt?.stringValue || 'Make money tips, side hustles, investing and passive income.').slice(0, 155);
    const image = fields.coverImage?.stringValue || 'https://www.cashflow-chronicle.com/og-image.jpg';
    const pageUrl = `https://www.cashflow-chronicle.com/post.html?id=${id}`;

    return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="CashFlow Chronicle" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>Redirecting...</body>
</html>`);
  } catch (e) {
    return res.redirect(302, `https://www.cashflow-chronicle.com/post.html?id=${id || ''}`);
  }
}
