export default function() {
  // Handle close button click
  document.getElementById("qr-close").addEventListener("click", function() {
    closeOverlay();
  });

  // Function to close the overlay
  function closeOverlay() {
    const overlay = document.getElementById("qr-overlay");
    if (overlay) {
      overlay.remove();
      document.body.style.overflow = "auto"; // Enable scrolling on the page
    }
    
    const overlayStyles = document.getElementById("qr-overlay-styles");
    if (overlayStyles) {
        overlayStyles.remove();
    }
  }
}
