document.addEventListener('DOMContentLoaded', function() {
    function getTemplateForDay() {
      const dayOfWeek = new Date().getDay();
      // Days: Sunday = 0, Monday = 1, ..., Saturday = 6
      // Display Portfolio 1 on Sunday, Tuesday, Thursday, Saturday (0, 2, 4, 6)
      const template1Days = [0, 2, 4, 6];
      return template1Days.includes(dayOfWeek) ? 'Portfolio1/index.html' : 'Portfolio2/index.html';
    }
  
    // Redirect to the appropriate portfolio after 3 secs
    setTimeout(() => {
      window.location.href = getTemplateForDay();
    }
    , 3000);
  });