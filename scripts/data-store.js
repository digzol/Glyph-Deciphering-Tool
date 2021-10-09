let glyphs = {};
let samples = [];
let sampleStrings = [];
let nextGlyphId = 0;

let _glyphCountCache = {};

function loadData() {
    let _glyphs = localStorage.getItem('glyphs');
    if (_glyphs != null) {
        glyphs = JSON.parse(_glyphs);
    }

    let _samples = localStorage.getItem('samples');
    if (_samples != null) {
        sampleStrings = JSON.parse(_samples);
        sampleStrings.forEach(function (str) {
            samples.push(sampleStringToArray(str));
        });
    }

    let _nextGlyphId = localStorage.getItem('nextGlyphId');
    if (_nextGlyphId != null) {
        nextGlyphId = parseInt(_nextGlyphId);
    }
}

function saveGlyphData() {
    localStorage.setItem('glyphs', JSON.stringify(glyphs));
}

function saveSampleData() {
    localStorage.setItem('samples', JSON.stringify(sampleStrings));
}

function newGlyphData(data) {
    glyphs[data.id] = data;
    saveGlyphData();
}

function newSampleData(data) {
    samples.push(data);
    sampleStrings.push(sampleArrayToString(data));
    increaseGlyphCount(data);
    saveSampleData();
}

function deleteSampleData(id) {
    decreaseGlyphCount(samples[id]);
    samples.splice(id, 1);
    sampleStrings.splice(id, 1);
    saveSampleData();
}

function sampleArrayToString(data) {
    let str = '';
    data.forEach(function (glyph) {
        str += "\\" + glyph.id;
    });
    return str;
}

function sampleStringToArray(dataString) {
    let arr = [];
    dataString.match(/\d+/g).forEach(function (id) {
        arr.push(glyphs[id]);
    });
    return arr;
}

function getNextGlyphId() {
    localStorage.setItem('nextGlyphId', (nextGlyphId + 1).toString());
    return nextGlyphId++;
}

function increaseGlyphCount(sample) {
    sample.forEach(function (glyph) {
        _glyphCountCache[glyph.id] = (_glyphCountCache[glyph.id] || 0) + 1;
    });
}

function decreaseGlyphCount(sample) {
    sample.forEach(function (glyph) {
        _glyphCountCache[glyph.id] = (_glyphCountCache[glyph.id] || 0) - 1;
    });
}

function getGlyphCount(i) {
    return _glyphCountCache[i]
}

loadData();