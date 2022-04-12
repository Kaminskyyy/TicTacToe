class Field {
	constructor() {
		this._field = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
	}

	getCell(x, y) {
		return this._field[3 - y][x - 1];
	}

	setCell(x, y, value) {
		this._field[3 - y][x - 1] = value;
	}

	getField() {
		return this._field;
	}

	_checkRow(id) {
		return this._field.some((row) => row.every((cell) => cell === id));
	}

	_checkColumn(id) {
		for (let i = 0; i <= 2; i++) {
			const column = [this._field[0][i], this._field[1][i], this._field[2][i]];

			if (column.every((cell) => cell === id)) {
				return true;
			}
		}
		return false;
	}

	_checkDiagonal(id) {
		const mainDiagonal = [];
		const secondaryDiagonal = [];

		for (let i = 0; i <= 2; i++) {
			mainDiagonal.push(this._field[i][i]);
			secondaryDiagonal.push(this._field[i][2 - i]);
		}

		if (mainDiagonal.every((cell) => cell === id)) return true;
		if (secondaryDiagonal.every((cell) => cell === id)) return true;
		return false;
	}

	_checkWin(id) {
		return this._checkRow(id) || this._checkColumn(id) || this._checkDiagonal(id);
	}

	checkGameOver(id) {
		const fieldFull = this._field.every((row) => row.every((cell) => cell != 0));
		const win = this._checkWin(id);
		return { over: fieldFull, id: win ? id : 0 };
	}

	resetField() {
		this._field = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
	}
}

module.exports = { Field };
