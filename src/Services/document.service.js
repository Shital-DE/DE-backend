
const paginateResults = ({ rows, index }) => {
    const pageSize = 50;
    const footerIndex = parseInt(index);
    const startIndex = (footerIndex - 1) * pageSize;
    let endIndex = footerIndex * pageSize;
    endIndex = Math.min(endIndex, rows.length);
    return rows.slice(startIndex, endIndex);
};

module.exports = {
    paginateResults
}