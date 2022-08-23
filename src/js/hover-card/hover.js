const getColor = () => {
  const photoKard = document.querySelectorAll('.photo-card');
  photoKard.forEach(card => {
    let color = getRandomHexColor();
    if (color.length !== 7) {
      color = '#14e2e9';
    }
    card.style.borderColor = color;
    card.addEventListener('mouseover', () => {
      card.style.boxShadow = `0 10px 15px ${color}`;
    });

    card.addEventListener('mouseout', () => {
      card.style.boxShadow = `0 0 0 transparent`;
    });
  });
};

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default getColor;
