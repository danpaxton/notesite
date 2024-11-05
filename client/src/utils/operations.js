export const getText = (data, raw) => {
    const res = []
    let left = 0, right = 0;
    while (right < data.length) {
        while (right < data.length && data[right] !== '<') {
            if (data[right] === '>') {
                left = right + 1;
            }
            ++right;
        }
        if (left !== right) {
            let str = data.slice(left, right).replaceAll('\n', '')
            str = str.replaceAll('&nbsp;', ' ').trim();
            str = str.replaceAll('&zwj;', '').trim();


            if (str !== '') {
                res.push(str);
            }
        }
        ++right;
    }
    if (!raw) {
        if (res.length === 0) {
            res.push('Untitled');
        }
        if (res.length === 1) {
            res.push('No additional notes');
        }
    }
    return res;
};

export const includeDate = (notes, i) => {
    if (i === 0) {
        return true;
    }
    if (notes[i - 1].pinned) {
        return !notes[i].pinned;
    }
    const d1 = (new Date(notes[i - 1].editedAt)).toDateString();
    const d2 = (new Date(notes[i].editedAt)).toDateString();

    return d1 !== d2;
};

export const firstPinned = (notes, i) =>  i === 0 && notes[i].pinned;

export const getDate = a => {
    const d = new Date(a);
    return d.toDateString();
};

export const sortDatePinned = (a, b) => {

    if(!a.pinned && b.pinned) {
        return 1;
    } else if (a.pinned && !b.pinned) {
        return -1;
    }
    const d1 = new Date(a.editedAt);
    const d2 = new Date(b.editedAt);
    if (d1 < d2) {
        return 1;
    } else if (d1 > d2) {
        return -1;
    } else {
        return 0;
    }
}