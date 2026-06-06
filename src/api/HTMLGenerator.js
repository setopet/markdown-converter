export class HTMLGenerator {

    generateParagraph(text) {
        return `<p>${text}</p>`;
    }

    generateHeadline(text, level) {
        if (level > 6) {
            throw new Error("Headline level out of range: " + level);
        }
        return `<h${level}>${text}</h${level}>`;
    }

    generateBold(text) {
        return `<b>${text}</b>`;
    }

    generateItalics(text) {
        return `<i>${text}</i>`;
    }

}
