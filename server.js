const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const mapRoutes = require('./routes/map');
const hndlbrs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', hndlbrs.engine({
    helpers: {
        getTerrainColor: (terrainType) => {
            const colors = {
                plains: 'lightgreen',
                forest: 'darkgreen',
                mountains: 'gray',
                desert: 'goldenrod',
                water: 'blue',
            };
            return colors[terrainType] || 'white';
        },
        json: (context) => JSON.stringify(context, null, 2),
    },
}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
    })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/map', mapRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.playerId) {
        return res.redirect('/');
    }

    try {
        const { Player, Tile } = require('./models');
        const player = await Player.findByPk(req.session.playerId);
        const tiles = await Tile.findAll({
            limit: 256,
        });
        res.render('dashboard', {
            username: player.username,
            faction: player.faction,
            resources: JSON.stringify(player.resources),
            tiles: tiles.map(tile => tile.toJSON()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});