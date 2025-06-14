document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tracker-form');
  const numberInput = document.getElementById('number-input');
  const resultBox = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const number = numberInput.value.trim();

    if (!number) {
      resultBox.innerHTML = `<p style="color: red;">Please enter a valid mobile number.</p>`;
      return;
    }

    resultBox.innerHTML = `<p>Searching for ${number}...</p>`;

    try {
      const response = await fetch(`/api/lookup/${number}`);
      const data = await response.json();

      if (response.ok) {
        resultBox.innerHTML = `
          <p><strong>Number:</strong> ${data.number}</p>
          <p><strong>Country:</strong> ${data.country}</p>
          <p><strong>Region:</strong> ${data.region}</p>
          <p><strong>Carrier:</strong> ${data.carrier}</p>
          <p><strong>Line Type:</strong> ${data.line_type}</p>
        `;
      } else {
        resultBox.innerHTML = `<p style="color: red;">Error: ${data.message || 'Unable to fetch data.'}</p>`;
      }
    } catch (err) {
      resultBox.innerHTML = `<p style="color: red;">Network error. Please try again later.</p>`;
    }
  });
});
