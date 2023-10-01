
document.addEventListener('DOMContentLoaded', function () {
    // Get the Ion List element
    const list = document.getElementById('adjustable-list');
  
    // Get all Ion Item elements inside the list
    const items = list.querySelectorAll('ion-item');
  
    // Find the item with the maximum content length
    let maxLength = 0;
  
    items.forEach((item) => {
      const itemTextLength = item.textContent.trim().length;
      maxLength = Math.max(maxLength, itemTextLength);
    });
  
    // Set a base font size (adjust as needed)
    const baseFontSize = 16; // in pixels
  
    // Calculate the font size based on the maximum content length
    const fontSize = baseFontSize / (maxLength / 10);
  
    // Apply the calculated font size to all items
    items.forEach((item) => {
      item.style.fontSize = `${fontSize}px`;
    });
  });