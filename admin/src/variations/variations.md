# Fetch Variations

Click the button below to download the variations JSON file.

<button id="fetch-variations">Fetch Variations</button>

<script>
  document.getElementById('fetch-variations').addEventListener('click', function () {
    fetch('http://localhost:3000/variations')
      .then(response => response.json())
      .then(data => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'variations.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  });
</script>
