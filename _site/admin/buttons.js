import CMS from 'netlify-cms-app';

// Function to download JSON as a file
const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const ButtonControl = ({ value, field }) => {
  const fetchURL = field.get('fetchURL');
  const filename = field.get('name');

  const handleClick = () => {
    fetch(fetchURL)
      .then(response => response.json())
      .then(data => downloadJSON(data, filename))
      .catch(error => alert(`Error fetching data: ${error.message}`));
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        {value || "Download JSON"}
      </button>
    </div>
  );
};

const ButtonPreview = ({ value }) => {
  return <button>{value || "Download JSON"}</button>;
};

// Register the custom widget
CMS.registerWidget('button', ButtonControl, ButtonPreview);
