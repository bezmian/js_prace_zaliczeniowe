class Note {
    constructor(title, content, color) {
        this.title = title;
        this.content = content;
        this.color = color;
        this.createdTime = Date.now();
        this.pinned = false;
    }
}
