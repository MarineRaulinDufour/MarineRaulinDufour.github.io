/// <reference path="../../../node_modules/@types/showdown/index.d.ts" />

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

        build() {
            this.buildSummary();
            this.buildContent();
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
            let content: string = this.content;
            content = this.showdownConverter.makeHtml(content);
            this.htmlContent.innerHTML = content;
        }
    }

    interface ghFile {
        name: string;
        content: string;
    }

    class PostEngine {
        items: Post[];
        constructor() {
            this.items = [];
        }
        init(): Promise<void> {
            return this.fetchPages().then((files: ghFile[]) => {
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



        fetchPages(): Promise<ghFile[]> {
            const p = new Promise<ghFile[]>((resolve, reject): void => {
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

        drawPostListPage(pageNumber: number) {
            let pageItems = this.items.slice(pageNumber * POSTS_PER_PAGE, POSTS_PER_PAGE);
            pageItems.forEach(item => {
                let name = item.name.substr(0, item.name.length - 3);
                let li = <HTMLLIElement>document.createElement("li");
                li.innerHTML = "<a href='atelier.html#" + name + "'>" + name + "</a>";
                document.getElementById("postMenuUl").appendChild(li);
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
        }

        init(): void {
            this.postEngine = new PostEngine();
            this.postEngine.init().then(() => {
                if (document.URL.indexOf("atelierMenu.html") != -1)
                    this.initMenu();
                else if (document.URL.indexOf("atelier.html")  != -1)
                    this.initPost();
            });
        }

        initMenu(): void {
            document.head.title = BLOG_NAME + " - Ateliers";
            let postUl = <HTMLUListElement>document.createElement("ul");
            postUl.id = "postMenuUl";
            document.getElementById("menu").appendChild(postUl);
            this.postEngine.drawPostListPage(0);
        }

        initPost(): void {
            let name = document.URL.substr(document.URL.indexOf('#') + 1);
            document.head.title = BLOG_NAME + " - " + name;
            document.getElementById("main");
            this.postEngine.drawPost(name);

        }
    }
}

window.onload = () => {
    let engine = new Niluar.Cms.Engine();
    engine.init();
}
