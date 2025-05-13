if (annyang) {
  const commands = {
    'hello': () => alert("Hello World!"),
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      const lower = page.toLowerCase();
      if (lower.includes("home")) window.location.href = "index.html";
      else if (lower.includes("stock")) window.location.href = "stocks.html";
      else if (lower.includes("dog")) window.location.href = "dogs.html";
    }
  };

  annyang.addCommands(commands);
}
