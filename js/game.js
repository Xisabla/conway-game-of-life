let game = {};

/* Default Config */

game.config = {
    'container': $('#game-of-life'),
    'size': [40, 20],
    'cells': [],
    'autoplay': ''
};

/** Calculation functions **/

game.isCell = function(tile) {
    let x = tile[0];
    let y = tile[1];
    let r = false;

    game.getCells().forEach(function(cell) {
        if (cell[0] === x && cell[1] === y) {
            r = true;
        }
    });

    return r;
};

game.getTile = function(element) {
    let x = parseInt($(element).attr('col'));
    let y = parseInt($(element).attr('row'));

    return [x, y];
};

game.getCells = function() {
    return game.config.cells;
};

game.getCellNeighbours = function(cell) {
    let x = cell[0];
    let y = cell[1];

    let neighbours = 0;

    if (game.isCell([x - 1, y + 1])) { neighbours++; }
    if (game.isCell([x, y + 1])) { neighbours++; }
    if (game.isCell([x + 1, y + 1])) { neighbours++; }
    if (game.isCell([x - 1, y])) { neighbours++; }
    if (game.isCell([x + 1, y])) { neighbours++; }
    if (game.isCell([x - 1, y - 1])) { neighbours++; }
    if (game.isCell([x, y - 1])) { neighbours++; }
    if (game.isCell([x + 1, y - 1])) { neighbours++; }

    return neighbours;
};

/** Definition functions **/

game.setContainer = function(container) {
    game.config.container = container;
};

game.setSize = function(size) {
    game.config.size = size;
};

game.addCell = function(cell) {
    if (!game.isCell(cell)) {
        game.getCells().push(cell);
    }
};

game.removeCell = function(cell) {
    let x = cell[0];
    let y = cell[1];

    game.config.cells.forEach(function(cell, index) {
        if (cell[0] === x && cell[1] === y) {
            game.config.cells.splice(index, 1);
        }
    });
};

game.toggleCell = function(tile) {
    if (game.isCell(tile)) {
        game.removeCell(tile);
    } else {
        game.addCell(tile);
    }

    /* Graphical changes */
    game.draw();
};

game.addCells = function(cells) {
    cells.forEach(function(cell) {
        game.addCell(cell);
    });
};

game.removeCells = function(cells) {
    cells.forEach(function(cell) {
        game.removeCell(cell);
    });
};

/** Procedural functions **/

game.init = function(options) {

    if (!options) { options = game.config; } else {
        if (!options.container) { options.container = game.config.container; }
        if (!options.size) { options.size = game.config.size; }
        if (!options.cells) { options.cells = game.config.cells; }
    }

    game.config = options;
};

game.draw = function() {
    let html = '';
    game.config.container.empty();

    html = '<table class="game-grid">';

    for (let y = 0; y < game.config.size[1]; y++) {
        html += '<tr>';
        for (let x = 0; x < game.config.size[0]; x++) {
            html += '<td col="' + x + '" row="' + y + '"></td>';
        }
        html += '</tr>';
    }

    html += '</table>';

    game.config.container.append(html);

    game.getCells().forEach(function(cell) {
        let x = cell[0];
        let y = cell[1];

        $('table.game-grid tr td[col=' + x + '][row=' + y + ']').addClass('cell');
    });

    $('table.game-grid tr td').click(function(e) {
        game.toggleCell(game.getTile(e.target));
    });
};

game.apply = function(pending) {
    game.addCells(pending.add);
    game.removeCells(pending.remove);

    game.draw();
};

game.step = function() {
    let pending = { 'add': [], 'remove': [] };

    for (let y = 0; y < game.config.size[1]; y++) {
        for (let x = 0; x < game.config.size[0]; x++) {
            let tile = [x, y];

            if (game.getCellNeighbours(tile) === 3) {
                pending.add.push(tile);
            }
        }
    }

    game.getCells().forEach(function(cell) {
        let neighbours = game.getCellNeighbours(cell);

        if (neighbours < 2) {
            pending.remove.push(cell);
        } else {
            if (neighbours > 3) {
                pending.remove.push(cell);
            }
        }
    });

    game.apply(pending);
};

game.play = function(delay) {
    game.autoplay = setInterval(game.step, delay);
};

game.stop = function() {
    clearInterval(game.autoplay);
};

game.clear = function() {
    if(game.config.autoplay !== '') {game.stop();}
    game.config.cells = [];
    game.draw();
};

game.randomize = function() {
    game.clear();

    for (let y = 0; y < game.config.size[1]; y++) {
        for (let x = 0; x < game.config.size[0]; x++) {
            if(Boolean(Math.floor(Math.random() * 2))) {
                let cell = [x, y];
                game.addCell(cell);
            }
        }
    }

    game.draw();
};

game.model = function(id) {
    let cells = [];

    if(id === 1) {cells = [[1,5],[1,7],[2,8],[3,8],[4,8],[5,8],[5,7],[5,6],[4,5]];}
    if(id === 2) {cells = [[0,4],[0,5],[1,4],[1,5],[10,4],[10,5],[10,6],[11,7],[11,3],[12,2],[13,2],[15,3],[16,4],[16,5],[16,6],[17,5],[15,7],[14,5],[12,8],[13,8],[20,4],[20,3],[20,2],[21,2],[21,3],[21,4],[22,1],[22,5],[24,0],[24,1],[24,5],[24,6],[35,3],[34,3],[34,2],[35,2]];}

    game.config.cells = cells;
    game.draw();
};