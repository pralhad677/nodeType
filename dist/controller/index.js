"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSampleData = (req, res) => {
    console.log(3);
    const data = { message: 'Sample data from the controller' };
    res.json(data);
};
exports.default = { getSampleData };
