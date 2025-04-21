const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const hbs = create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

const parseGridData = () => {
    const filePath = path.join(__dirname, '../testgridinfo.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent
        .trim()
        .split('\n')
        .map(line => line.trim().split(/\s+/).map(Number));
};

app.get('/', (req, res) => {
    const gridData = parseGridData();
    res.render('grid', { title: '50x50 Grid', rows: gridData });
});

app.post('/cell-click', express.json(), (req, res) => {
    const { row, col } = req.query;
    console.log(`Cell clicked: Row ${row}, Col ${col}`);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});