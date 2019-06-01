/// <reference path="../../../../node_modules/@types/showdown/index.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Niluar;
(function (Niluar) {
    var Cms;
    (function (Cms) {
        var SUMMARY_LENGTH = 40000;
        var POSTS_PER_PAGE = 10;
        var BLOG_NAME = "A Framework document";
        var REPO = "/repos/marinedufour/pages/contents/content/posts/";
        class Post {
            constructor(name, content) {
                this.showdownConverter = new showdown.Converter();
                this.showdownConverter = new showdown.Converter();
                this.name = name;
                this.content = content;
            }
            buildSummary() {
                this.htmlSummary = document.createElement("div");
                this.htmlSummary.classList.add("postSummary");
                let summary = this.content;
                if (summary.length > SUMMARY_LENGTH) {
                    summary = summary.substr(0, SUMMARY_LENGTH - 3) + "...";
                }
                summary = this.showdownConverter.makeHtml(summary);
                this.htmlSummary.innerHTML = summary;
            }
            buildContent() {
                this.htmlContent = document.createElement("div");
                let content = this.content.replace(/\.\/images\//g, "https://marineraulindufour.github.io/content/posts/images/");
                content = this.showdownConverter.makeHtml(content);
                this.htmlContent.innerHTML = content;
                this.htmlContent.querySelectorAll("img").forEach(img => {
                    img.parentElement.style.textAlign = "center";
                });
            }
        }
        class PostEngine {
            constructor() {
                this.items = [];
            }
            initMenu() {
                return __awaiter(this, void 0, void 0, function* () {
                    return this.fetchPages(false).then((files) => {
                        files.forEach(file => {
                            let item = new Post(file.name, file.content);
                            // item.buildSummary();
                            this.items.push(item);
                        });
                    });
                    // TODO sort by date DESC
                });
            }
            initPost() {
                return __awaiter(this, void 0, void 0, function* () {
                    return this.fetchPages(true).then((files) => {
                        files.forEach(file => {
                            let item = new Post(file.name, file.content);
                            item.buildContent();
                            this.items.push(item);
                        });
                    });
                    // TODO sort by date DESC
                });
            }
            fetchPages(isFetchingContent) {
                return __awaiter(this, void 0, void 0, function* () {
                    return fetch("https://api.github.com/repos/marineRaulinDufour/MarineRaulinDufour.github.io/contents/content/posts/")
                        .then(result => result.json())
                        .then((results) => {
                        results = results.filter(r => r.name.indexOf(".md") != -1);
                        if (!isFetchingContent)
                            return results;
                        return Promise.all(results.map(r => fetch(r.download_url).then((result) => __awaiter(this, void 0, void 0, function* () {
                            const text = yield result.text();
                            r.content = text;
                            return r;
                        }))));
                    });
                });
            }
            drawPostListPage(pageNumber) {
                let pageItems = this.items.slice(pageNumber * POSTS_PER_PAGE, POSTS_PER_PAGE);
                pageItems.forEach(item => {
                    let name = item.name.substr(0, item.name.length - 3);
                    let li = document.createElement("li");
                    li.innerHTML = "<a href='atelier.html#" + name + "'>" + name + "</a>";
                    document.getElementById("menu").appendChild(li);
                });
            }
            drawPost(name) {
                let content = this.items.filter(f => f.name == name + ".md")[0].htmlContent;
                document.getElementById("main").appendChild(content);
            }
        }
        class Engine {
            constructor() {
                this.pageId = "workshopToc";
                this.postEngine = new PostEngine();
            }
            initMenu() {
                this.postEngine.initMenu().then(() => {
                    document.head.title = BLOG_NAME + " - Ateliers";
                    this.postEngine.drawPostListPage(0);
                });
            }
            initPost() {
                this.postEngine.initPost().then(() => {
                    let name = decodeURI(document.URL.substr(document.URL.indexOf('#') + 1));
                    document.head.title = BLOG_NAME + " - " + name;
                    document.getElementById("main");
                    this.postEngine.drawPost(name);
                });
            }
        }
        Cms.Engine = Engine;
    })(Cms = Niluar.Cms || (Niluar.Cms = {}));
})(Niluar || (Niluar = {}));
window.onload = () => {
    let engine = new Niluar.Cms.Engine();
    if (document.URL.indexOf("atelierMenu.html") != -1)
        engine.initMenu();
    else if (document.URL.indexOf("atelier.html") != -1)
        engine.initPost();
};
