# Fetch Categories

Click the button below to download the categories JSON file.

<button id="fetch-categories">Fetch Categories</button>

<script>
  document.getElementById('fetch-categories').addEventListener('click', function () {
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(data => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'categories.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  });
</script>
