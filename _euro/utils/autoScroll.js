// autoscroll to bottom
const autoScroll = async (page) => {
  if (!page) {
    console.log("autoScroll: page not provided");
    return;
  }

  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

module.exports = { autoScroll };
