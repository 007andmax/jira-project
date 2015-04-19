function findById(arrayObj, id) {
    for (var i = 0; i < arrayObj.length; i++)
        if (arrayObj[i].id === id)
            return arrayObj[i];
    return;
};
