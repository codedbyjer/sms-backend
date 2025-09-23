const validateIdParams = (id) => {
    const idNum = Number(id);
    if (isNaN(idNum || idNum <= 0)) {
        return false;
    }
    return idNum;
}

module.exports = validateIdParams;