const MONTHS = {
    jan: 'January',
    feb: 'February',
    mar: 'March',
    apr: 'April',
    may: 'May',
    jun: 'June',
    jul: 'July',
    aug: 'August',
    sep: 'September',
    oct: 'October',
    nov: 'November',
    dec: 'December'
};

export function compileTimeline (timeline) {
    let compiled = [];
    let entries = Object.entries(timeline);

    for (let i = 0; i < entries.length; i++) {
        let [monthYear, projects] = entries[i];
        monthYear = ` ${MONTHS[monthYear.slice(0, 3)]} 20${monthYear.slice(3)}`;
        for (let i = 0; i < projects.length; i++) projects[i].date += monthYear;
        compiled.push(...projects);
    }

    return compiled;
}

export function breakSimpleMarkdown (text) {
    return text
        .replace(/\[(.*?)\]\((.*?)\)/g, (_, text, href) => {
            if (href == "github") {
                href = `https://github.com/${text}`;
                if (!text.includes('/')) text = `@${text}`;
            }

            return `<a href="${href}" target="_blank">${text}</a>`;
        });
}