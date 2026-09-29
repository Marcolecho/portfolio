document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  
  let currentIndex = 0;

  if(slides.length <= 1){
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    dotsContainer.style.display = "none";
  }
  else{
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(targetIndex) {
      if (targetIndex === currentIndex) return;

      // Mettre en pause la vidéo du slide actuel si elle tourne
      const currentSlide = slides[currentIndex];
      const currentVideo = currentSlide.querySelector('video');
      if (currentVideo) {
        currentVideo.pause();
      }

      slides[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');

      if (targetIndex >= slides.length) {
        currentIndex = 0;
      } else if (targetIndex < 0) {
        currentIndex = slides.length - 1;
      } else {
        currentIndex = targetIndex;
      }

      slides[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
    }

    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
});