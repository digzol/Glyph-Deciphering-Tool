let $glyphEntries, $glyphEntryTemplate, $glyphButtons, $glyphButtonTemplate, $activeSampleArea,
    $sampleGlyphTemplate, $sampleEntries;

let currentSample = [];

function clearGlyphCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function insertGlyphElements(data) {
    let $newEntry = $glyphEntryTemplate.clone(true);
    $newEntry.data('glyph', data);
    $newEntry.attr('id', 'glyph-entry-' + data.id);
    $newEntry.addClass('glyph-id-' + data.id);
    $newEntry.find('.glyph-img').attr({
        src: data.dataURL,
        title: "Glyph #" + data.id,
    });
    $newEntry.find('.glyph-def').val(data.def);
    $newEntry.find('.glyph-frequency').html(getGlyphCount(data.id));
    $newEntry.show();

    $glyphEntries.append($newEntry);

    let $newGlyphBtn = $glyphButtonTemplate.clone(true);
    $newGlyphBtn.data('glyph', data);
    $newGlyphBtn.find('.glyph-img').attr({
        src: data.dataURL,
        title: "Glyph #" + data.id,
    });
    $newGlyphBtn.removeAttr('id');
    $newGlyphBtn.addClass('glyph-id-' + data.id);
    $newGlyphBtn.show();

    $glyphButtons.append($newGlyphBtn);
}

function insertSampleElements(sampleData) {
    let glyphElements = [];
    sampleData.forEach(function (data) {
        let $glyphDiv = $('<div class="glyph-wrapper"></div>');
        let $glyphImage = $('<img class="glyph-img" />').attr({
            src: data.dataURL,
            alt: "Glyph #" + data.id,
            title: "Glyph #" + data.id,
        });
        let $glyphDefinition = $(`<div class="glyph-def"></div>`)
            .html(data.def || '-')
            .attr('data-glyphDefID', data.id);

        $glyphDiv.append($glyphImage, $glyphDefinition);
        glyphElements.push($glyphDiv);
    });

    let $deleteBtn = $('<button class="btn-delete-sample">Delete</button>').on('click', onDeleteSample);
    let $sampleDiv = $('<div class="sample-entry"></div>').append(glyphElements, $deleteBtn);
    $sampleEntries.prepend($sampleDiv);
}

function updateFrequencyValuesFor(glyphs) {
    glyphs.forEach(function (glyph) {
        $('#glyph-entry-' + glyph.id).find('.glyph-frequency').html(getGlyphCount(glyph.id));
    });
}

function onDeleteSample() {
    let id = samples.length - $(this).parent('.sample-entry').index('#sample-entries .sample-entry') - 1;
    let dataRemoved = samples[id];
    $(this).parent('.sample-entry').remove();
    deleteSampleData(id);
    updateFrequencyValuesFor(dataRemoved);
}

$(document).ready(function () {
    $glyphEntries = $('#glyph-dictionary-entries');
    $glyphButtons = $('#available-glyphs');
    $activeSampleArea = $('#active-text-sample');
    $sampleEntries = $('#sample-entries');
    $glyphEntryTemplate = $('#dictionary-entry-template');
    $glyphButtonTemplate = $('#glyph-button-template');
    $sampleGlyphTemplate = $('#sample-text-template');

    samples.forEach(function (data) {
        insertSampleElements(data);
        increaseGlyphCount(data);
    });

    for (let i in glyphs) {
        let glyph = glyphs[i];
        if (!glyph.flaggedForDeletion) {
            insertGlyphElements(glyph);
        }
    }

    $('#btn-addGlyph').on('click', function () {
        let data = {
            id: getNextGlyphId(),
            dataURL: canvas.toDataURL(),
            def: '',
        };
        newGlyphData(data);
        insertGlyphElements(data);
        clearGlyphCanvas();
    });

    $('#btn-clearGlyph').on('click', clearGlyphCanvas);

    $('.glyph-def').on('keydown', function (e) {
        if (e.key.length === 1)
            $(this).val('');
    }).on('keyup', function () {
        let data = $(this).parent('.glyph-entry').data('glyph');
        data.def = $(this).val();
        saveGlyphData();
        $(`.glyph-def[data-glyphDefID="${data.id}"]`).html(data.def || '-');
    });

    $('.btn-delete-glyph').on('click', function (e) {
        if (confirm('Are you sure you want to delete this glyph and all its references?')) {
            let data = $(this).parent('.glyph-entry').data('glyph');
            $('.glyph-id-' + data.id).remove();
            glyphs[data.id].flaggedForDeletion = true; // TODO: Delete glyph if no mentions remaining
            saveGlyphData();
        }
    });

    $('.btn-glyph').on('click', function (e) {
        let data = $(this).data('glyph');
        let $newEntry = $sampleGlyphTemplate.clone(true);
        $newEntry.find('.glyph-img').attr({
            src: data.dataURL,
            title: "Glyph #" + data.id,
        });
        $newEntry.removeAttr('id');
        $newEntry.addClass('glyph-id-' + data.id);
        $newEntry.show();

        $activeSampleArea.append($newEntry);
        currentSample.push(data);
    });

    $('.sample-text-glyph').on('click', function (e) {
        let i = $(this).index('#active-text-sample .sample-text-glyph');
        currentSample.splice(i - 1, 1);
        $(this).remove();
    });

    $('#btn-save-sample').on('click', function (e) {
        if (currentSample.length > 0) {
            insertSampleElements(currentSample);
            newSampleData(currentSample);
            updateFrequencyValuesFor(currentSample);
            currentSample = [];
            $('#active-text-sample .sample-text-glyph').not('#sample-text-template').remove();
        }
    });
});