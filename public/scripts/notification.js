    //notification popup to show errors
    const notification = document.querySelector('.notification');
    // Function to show notification
    function showNotification(message,color) {
      notification.style.zIndex=1500; 
      notification.textContent = message;
      notification.style.display = 'block';
      notification.style.background =color;
      // Force reflow
      notification.offsetHeight;
      notification.style.opacity = '1';
      
      setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => notification.style.display = 'none', 300);
      }, 3000);
    }