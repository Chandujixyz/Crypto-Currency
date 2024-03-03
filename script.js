function fetchDataAndRenderTable() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then(response => response.json())
      .then(data => renderTable(data))
      .catch(error => console.error('Error fetching data:', error));
  }

  function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('tr');
      const percentChange = parseFloat(item.price_change_percentage_24h);

      let color = 'black'; // Default color for neutral values

      if (!isNaN(percentChange)) {
        color = percentChange >= 0 ? 'green' : 'red';
      }

      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" width="20" height="20">${item.name}</td>
        <td>${item.symbol.toUpperCase()}</td>
        <td>${"$" + item.current_price}</td>
        <td>${"$" + item.total_volume}</td>
        <td style="color: ${color};">${percentChange + "%"}</td>
        <td>${"Mkt Cap : $" + item.market_cap}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function sort(column) {
    const tableBody = document.getElementById('tableBody');
    const rows = Array.from(tableBody.getElementsByTagName('tr'));

    const sortedRows = rows.sort((a, b) => {
      const aValue = parseMarketCap(a.getElementsByTagName('td')[columnMap[column]].innerText);
      const bValue = parseMarketCap(b.getElementsByTagName('td')[columnMap[column]].innerText);
      return aValue - bValue;
    });

    const fragment = document.createDocumentFragment();
    sortedRows.forEach(row => fragment.appendChild(row));

    tableBody.innerHTML = '';
    tableBody.appendChild(fragment);
  }

  const columnMap = {
    'percentChange': 4,
    'marketCap': 5,
  };

  function parseMarketCap(value) {
    // Remove "$" and commas from the market cap value before parsing
    return parseFloat(value.replace(/[Mkt Cap : $,]/g, '')) || 0;
  }

  // Fetch and render the table initially
  fetchDataAndRenderTable();

  // Add event listener for input changes to update the table in real-time
  document.getElementById('searchInput').addEventListener('input', function () {
    const input = this.value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');

    rows.forEach(row => {
        const name = row.getElementsByTagName('td')[0].innerText.toLowerCase();
    const symbol = row.getElementsByTagName('td')[1].innerText.toLowerCase();

    if (name.includes(input) || symbol.includes(input)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});
