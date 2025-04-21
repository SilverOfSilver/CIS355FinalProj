document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('table');

    table.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD') {
            const row = event.target.getAttribute('data-row');
            const col = event.target.getAttribute('data-col');

            fetch(`/cell-click?row=${row}&col=${col}`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    console.log(`Cell clicked: Row ${row}, Col ${col}`);
                })
                .catch(error => console.error('Error:', error));
        }
    });
});

const gridContainer = document.createElement('div');
gridContainer.className = 'grid-container';

for (let i = 0; i < 50; i++) {
    const row = document.createElement('div');
    row.className = 'grid-row';
    for (let j = 0; j < 50; j++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = i;
        cell.dataset.col = j;

        cell.addEventListener('click', () => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            fetch(`/cell-clicked?row=${row}&col=${col}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.message);
                })
                .catch(error => console.error('Error:', error));
        });

        row.appendChild(cell);
    }
    gridContainer.appendChild(row);
}

document.body.appendChild(gridContainer);