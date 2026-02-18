// Script to extract Things data from the page
const things = [];
const taskElements = document.querySelectorAll('div[role="button"]');

taskElements.forEach((el) => {
  const title = el.querySelector('p')?.innerText;
  const dateEl = el.querySelector('text')?.innerText || el.innerText.match(/\d{1,2}\s\w+\.?/)?.[0];
  
  if (title && title.length > 0) {
    things.push({
      title: title,
      date: dateEl || 'Unknown'
    });
  }
});

console.log(JSON.stringify(things, null, 2));
