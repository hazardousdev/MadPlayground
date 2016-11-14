function updateScene(objects) {
    // здесь нужно заполнять objects[] объектами, у которых есть position, modelId, textureId
    // это тупо, надо придумать другой вариант
    // скорее всего, updateScene вообще не должен быть частью renderer
    objects.push(worm.head);
    worm.bodies.forEach(function (item, i, arr) {
        objects.push(item);
    });
    apples.forEach(function (item, i, arr) {
        objects.push(item);
    });
    walls.forEach(function (item, i, arr) {
        objects.push(item);
    });
    objects.push(ground);
}