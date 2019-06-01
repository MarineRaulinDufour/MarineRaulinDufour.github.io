/// <reference path="../../../../node_modules/@types/showdown/index.d.ts" />

namespace Niluar.Cms {
    var SUMMARY_LENGTH: number = 40000;
    var POSTS_PER_PAGE: number = 10;
    var BLOG_NAME: string = "A Framework document";
    var REPO: string = "/repos/marinedufour/pages/contents/content/posts/";

    class Post {
        name: string;
        id: string;
        title: string;
        content: string;
        htmlSummary: HTMLDivElement;
        htmlContent: HTMLDivElement;
        showdownConverter = new showdown.Converter();

        constructor(name: string, content: string) {
            this.showdownConverter = new showdown.Converter();
            this.name = name;
            this.content = content;
        }

        buildSummary(): any {
            this.htmlSummary = <HTMLDivElement>document.createElement("div");
            this.htmlSummary.classList.add("postSummary");
            let summary: string = this.content;
            if (summary.length > SUMMARY_LENGTH) {
                summary = summary.substr(0, SUMMARY_LENGTH - 3) + "...";
            }
            summary = this.showdownConverter.makeHtml(summary);
            this.htmlSummary.innerHTML = summary;
        }

        buildContent(): any {
            this.htmlContent = <HTMLDivElement>document.createElement("div");
            let content: string = this.content.replace(/\.\/images\//g, "https://marineraulindufour.github.io/content/posts/images/");
            content = this.showdownConverter.makeHtml(content);
            this.htmlContent.innerHTML = content;
            this.htmlContent.querySelectorAll("img").forEach(img => {
                img.parentElement.style.textAlign = "center";
            });
        }
    }

    interface ghFile {
        name: string;
        url?: string;
        download_url?: string;
        content?: string;
    }

    class PostEngine {
        items: Post[];
        constructor() {
            this.items = [];
        }

        async initMenu(): Promise<void> {
            return this.fetchPages(false).then((files: ghFile[]) => {
                files.forEach(file => {
                    let item = new Post(file.name, file.content);
                    // item.buildSummary();
                    this.items.push(item);
                });
            });
            // TODO sort by date DESC
        }

        async initPost(): Promise<void> {
            return this.fetchPages(true).then((files: ghFile[]) => {
                files.forEach(file => {
                    let item = new Post(file.name, file.content);
                    item.buildContent();
                    this.items.push(item);
                });
            });
            // TODO sort by date DESC
        }

        async fetchPages(isFetchingContent: boolean): Promise<ghFile[]> {
            return fetch("https://api.github.com/repos/marineRaulinDufour/MarineRaulinDufour.github.io/contents/content/posts/")
                .then(result => result.json())
                .then((results: ghFile[]) => {
                    results = results.filter(r => r.name.indexOf(".md") != -1);
                    if (!isFetchingContent)
                        return results;
                    return Promise.all(results.map(r => fetch(r.download_url).then(async (result) => {
                        const text = await result.text();
                        r.content = text;
                        return r;
                    })
                    ));
                });
        }

        drawPostListPage(pageNumber: number) {
            let pageItems = this.items.slice(pageNumber * POSTS_PER_PAGE, POSTS_PER_PAGE);
            pageItems.forEach(item => {
                let name = item.name.substr(0, item.name.length - 3);
                let li = <HTMLLIElement>document.createElement("li");
                li.innerHTML = "<a href='atelier.html#" + name + "'>" + name + "</a>";
                document.getElementById("menu").appendChild(li);
            });
        }

        drawPost(name: string) {
            let content = this.items.filter(f => f.name == name + ".md")[0].htmlContent;
            document.getElementById("main").appendChild(content);
        }
    }

    export class Engine {
        postEngine: PostEngine;
        pageId: string;

        constructor() {
            this.pageId = "workshopToc";
            this.postEngine = new PostEngine();
        }

        initMenu(): void {
            this.postEngine.initMenu().then(() => {
                document.head.title = BLOG_NAME + " - Ateliers";
                this.postEngine.drawPostListPage(0);
            });
        }

        initPost(): void {
            this.postEngine.initPost().then(() => {
                let name = decodeURI(document.URL.substr(document.URL.indexOf('#') + 1));
                document.head.title = BLOG_NAME + " - " + name;
                document.getElementById("main");
                this.postEngine.drawPost(name);
            });
        }
    }
}

window.onload = () => {
    let engine = new Niluar.Cms.Engine();
    if (document.URL.indexOf("atelierMenu.html") != -1)
        engine.initMenu();
    else if (document.URL.indexOf("atelier.html") != -1)
        engine.initPost();

}