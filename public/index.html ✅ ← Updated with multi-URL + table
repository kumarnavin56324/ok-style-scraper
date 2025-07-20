public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Media Source Extractor</title>
</head>
<body>
  <h2>Media Source Extractor</h2>
  <input type="text" id="url" placeholder="Enter website URL" size="50" />
  <button onclick="extract()">Extract URLs</button>
  <button onclick="copyText()">Copy Result</button>
  <button onclick="exportCSV()">Export CSV</button>
  <button onclick="clearAll()">Clear</button>
  <br><br>
  <textarea id="output" rows="10" style="width: 100%;"></textarea>

  <script>
    async function extract() {
      const url = document.getElementById("url").value;
      const output = document.getElementById("output");
      output.value = "Extracting...";

      const res = await fetch(`/extract?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.sources) {
        output.value = data.sources.join('\\n');
      } else {
        output.value = "No sources found.";
      }
    }

    function copyText() {
      const text = document.getElementById("output");
      text.select();
      document.execCommand("copy");
    }

    function exportCSV() {
      const text = document.getElementById("output").value.split("\\n");
      const csv = "data:text/csv;charset=utf-8," + text.map(e => `"${e}"`).join("\\n");
      const encodedUri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "sources.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function clearAll() {
      document.getElementById("url").value = "";
      document.getElementById("output").value = "";
    }
  </script>
</body>
</html>
