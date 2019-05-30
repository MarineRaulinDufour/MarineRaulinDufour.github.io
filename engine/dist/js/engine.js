/// <reference path="../../../node_modules/@types/showdown/index.d.ts" />
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
            build() {
                this.buildSummary();
                this.buildContent();
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
                let content = this.content;
                content = this.showdownConverter.makeHtml(content);
                this.htmlContent.innerHTML = content;
            }
        }
        class PostEngine {
            constructor() {
                this.items = [];
            }
            init() {
                return this.fetchPages().then((files) => {
                    files.forEach(file => {
                        let item = new Post(file.name, file.content);
                        item.build();
                        this.items.push(item);
                    });
                });
                // TODO sort by date DESC
            }
            // fetchPages(): Promise<void> {
            //     return fetch(REPO + "/content/posts/").then(result => {
            //         // TODO get directory and fetch md pages : https://developer.github.com/v3/repos/contents/
            //     });
            // }
            fetchPages() {
                const p = new Promise((resolve, reject) => {
                    resolve([{
                            "name": "Ateliers_enfants.md",
                            "content": `# Ateliers enfants

## Design Culinaire

L’atelier est une nouvelle expérience créative à travers un cour de cuisine original. Des sculptures de riz à la tasse en cookies... 

![Image design culinaire](./content/posts/images/design_culinaire.jpg)

## De la magie dans l’art

A travers des ateliers artistiques et scientifiques les enfants vont créer comme par magie. (popups, l’ardoise magique… )

## Atelier des Artistes

Créer des projets artistiques en s’inspirant d’artiste. Engager de nouveaux moyens d’expression à travers de nouveaux mediums et découvrir de nouvelle façon de les utiliser de la peinture au pistolet de Niki Saint Phalle au photomontage d’Hanna Hoch. 

## Création livre « Ou suis-je ? »

A travers chaque page, une découverte de plusieurs techniques artistiques. 

## Stop motion

Le Stop-motion est une technique d'animation qui donne l’illusion de faire bouger les images. Le procédé consiste, par un défilé d'images fixes à donner l’impression d’un mouvement, simulé par le déplacement des objets ou des personnages. 

## Modelage/Sculpture

Initiation aux arts du modelage, du moulage et de l’assemblage.

# Découverte des Arts Visuels

A partir d’une histoire et des jeux on découvre comment utiliser différents mediums. (Peinture, encre, fusain…)
`
                        },
                        {
                            "name": "Ateliers_seniors.md",
                            "content": `# Ateliers seniors
## L'Atelier des Artistes
### 1h00+2h00

Petite conférence sur de la vie des Artistes, biographie visuelle et animée
Création et technique de l’Artiste
Visite d’une exposition

## L’atelier initiation des Arts visuels
### 2h00

Découverte de différent medium
Fusain, peinture, aquarelle, papier, encre, gravure, craies, terre, sérigraphie 

## L’atelier d’Art Floral
### 1h00+1h00

Choix des fleurs, rencontre de fleuriste, visite de marché
Création de bouquet, initiation ikebana 

## L’atelier Design Culinaire
### 3h00

Réalisation de recette de cuisine                  
Art de la table

## L’atelier modelage
### 2h00

Travail de la terre, du papier, du sable 

- Sur demande les ateliers peuvent être ajustés
`
                        }]);
                });
                return p;
            }
            drawPostListPage(pageNumber) {
                let pageItems = this.items.slice(pageNumber * POSTS_PER_PAGE, POSTS_PER_PAGE);
                pageItems.forEach(item => {
                    let name = item.name.substr(0, item.name.length - 3);
                    let li = document.createElement("li");
                    li.innerHTML = "<a href='atelier.html#" + name + "'>" + name + "</a>";
                    document.getElementById("postMenuUl").appendChild(li);
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
            }
            init() {
                this.postEngine = new PostEngine();
                this.postEngine.init().then(() => {
                    if (document.URL.indexOf("atelierMenu.html") != -1)
                        this.initMenu();
                    else if (document.URL.indexOf("atelier.html") != -1)
                        this.initPost();
                });
            }
            initMenu() {
                document.head.title = BLOG_NAME + " - Ateliers";
                let postUl = document.createElement("ul");
                postUl.id = "postMenuUl";
                document.getElementById("menu").appendChild(postUl);
                this.postEngine.drawPostListPage(0);
            }
            initPost() {
                let name = document.URL.substr(document.URL.indexOf('#') + 1);
                document.head.title = BLOG_NAME + " - " + name;
                document.getElementById("main");
                this.postEngine.drawPost(name);
            }
        }
        Cms.Engine = Engine;
    })(Cms = Niluar.Cms || (Niluar.Cms = {}));
})(Niluar || (Niluar = {}));
window.onload = () => {
    let engine = new Niluar.Cms.Engine();
    engine.init();
};
