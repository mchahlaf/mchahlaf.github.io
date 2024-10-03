function createlogin() {
  let body = document.body;
  let FormConn = document.createElement("form");
  FormConn.id = "FormConn";

  let DivTitle = document.createElement("div");
  DivTitle.id = "Title";
  DivTitle.style.margin = "20px 0"; // Pour ajouter des marges avant et après le titre
  DivTitle.style.textAlign = "center"; // Pour centrer horizontalement

  let Title = document.createElement("h1");
  Title.id = "IntraTitle";
  Title.innerText = "Intra GraphQL";

  DivTitle.appendChild(Title);

  let Users = document.createElement("input");
  Users.id = "AreaUser";
  Users.type = "texte";
  Users.required = true;

  let TextUser = document.createElement("label");
  TextUser.htmlFor = "AreaUser";
  TextUser.innerText = "Email ou Nom d'utilisateur";
  TextUser.style.display = "block"; // Supprime le saut de ligne en forçant l'affichage en bloc

  let Mdp = document.createElement("input");
  Mdp.id = "AreaMdp";
  Mdp.type = "password";
  Mdp.required = true;

  let TextMdp = document.createElement("label");
  TextMdp.htmlFor = "AreaMdp";
  TextMdp.innerText = "Mot de passe";
  TextMdp.style.display = "block"; // Supprime le saut de ligne

  let Submit = document.createElement("input");
  Submit.id = "Send";
  Submit.type = "button";
  Submit.value = "Se Connecter";

  FormConn.appendChild(DivTitle);  // Ajout du titre
  FormConn.appendChild(TextUser);
  FormConn.appendChild(Users);
  FormConn.appendChild(TextMdp);
  FormConn.appendChild(Mdp);
  FormConn.appendChild(Submit);
  body.appendChild(FormConn);

  FormConn.addEventListener("keydown", async function () {
    if (event.key === "Enter") {
      event.preventDefault(); // Empêche le comportement par défaut
      Submit.click(); // Simule un clic sur le bouton "Se Connecter"
    }
  });
  Submit.addEventListener("click", async function () {
    event.preventDefault();
    const Username = Users.value;
    const UserMdp = Mdp.value;
    const info = btoa(`${Username}:${UserMdp}`);
    try {
      const raiponce = await fetch("https://zone01normandie.org/api/auth/signin", {
        method: "POST",
        headers: {
          Authorization: `Basic ${info}`,
        },
      });
      if (raiponce.ok) {
        const data = await raiponce.json();
        localStorage.setItem("jwt", data.token);
        DrawIntra(data);
      }
    } catch (error) {
      alert("coucou");
    }
  });
}
  
  function DrawIntra(data) {
    document.body.innerHTML = "";
    const query = {
      query: `{
          user{
              id
              lastName
              firstName
              auditRatio
              totalUp
              totalDown
          }
              transaction{
                  amount
                  type
              }
          }`,
    };
    const query2 = {
      query: `{
           user {
                xps {
                     amount
                }
           }
      }`,
    };
    const query3 = {
      query: `{
           user {
                transactions(order_by: {createdAt: asc}){
                     type
                     amount
                }
           }
      }`,
    };
    fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data}`,
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        const data2 = data.data.user[0];
        let delog = document.createElement("input");
        delog.id = "delog";
        delog.type = "button"
        delog.value = "Se Deconnecter"
        delog.addEventListener("click", function () {
          location.reload();
        });
        document.body.appendChild(delog);
        let Divpseud = document.createElement("div");
        Divpseud.id = "Name";
        let Name = document.createElement("h1");
        Name.id = "IntraName";
        Name.innerText = "Bienvenue " + data2.firstName + " " + data2.lastName;
        let auditratin = document.createElement("div");
        auditratin.id = "ration";
        let ratiotexte = document.createElement("h1");
        ratiotexte.id = "Textration";
        ratiotexte.innerText = "Audits ratio";
        let total = document.createElement("h4");
        total.id = "total";
        total.innerText = Math.round(data2.auditRatio * 10) / 10;
        if (total.innerText < 1){
          total.style.color = "#ff4343"
        } else {
          total.style.color = "#4355ff"
        }
        total.style.fontSize = "50px"
        total.style.marginTop = "20px"
        total.style.fontFamily = "IBM Plex Sans', sans-serif"
        let maxwidth = 300;
        const scalefactor = maxwidth / Math.max(data2.totalUp, data2.totalDown);
        const svgNS = "http://www.w3.org/2000/svg"; // Espace de noms SVG requis
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "275");
        svg.setAttribute("height", "50");
        // Créer un rectangle
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", "10"); // Position x du coin supérieur gauche
        rect.setAttribute("y", "10"); // Position y du coin supérieur gauche
        rect.setAttribute("width", (data2.totalUp * scalefactor) / 2); // Largeur du rectangle
        rect.setAttribute("height", "10"); // Hauteur du rectangle
        rect.setAttribute("fill", "#4355ff"); // Couleur de remplissage
        rect.setAttribute("rx", "10"); // Couleur de remplissage
        rect.setAttribute("ry", "10"); // Couleur de remplissage
        const Danna = document.createElementNS(svgNS, "text");
        Danna.setAttribute("x", (data2.totalUp * scalefactor + 55) / 2); // Position x du coin supérieur gauche
        Danna.setAttribute("y", "20"); // Position y du coin supérieur gauche
        Danna.setAttribute("font-family", "Arial"); // Hauteur du rectangle
        Danna.setAttribute("font-size", "12"); // Couleur de remplissage
        Danna.setAttribute("fill", "white"); // Couleur de remplissage
        Danna.textContent = `Received, ${(data2.totalUp * 10e-7).toFixed(2)} MB`;
        svg.appendChild(Danna);
        // Créer un rectangle
        const rec = document.createElementNS(svgNS, "rect");
        rec.setAttribute("x", "10"); // Position x du coin supérieur gauche
        rec.setAttribute("y", "40"); // Position y du coin supérieur gauche
        rec.setAttribute("width", (data2.totalDown * scalefactor) / 2); // Largeur du rectangle
        rec.setAttribute("height", "10"); // Hauteur du rectangle
        rec.setAttribute("fill", "#ff4343"); // Couleur de remplissage
        rec.setAttribute("rx", "10"); // Couleur de remplissage
        rec.setAttribute("ry", "10"); // Couleur de remplissage
        const Dianna = document.createElementNS(svgNS, "text");
        Dianna.setAttribute("x", (data2.totalDown * scalefactor + 55) / 2); // Position x du coin supérieur gauche
        Dianna.setAttribute("y", "50"); // Position y du coin supérieur gauche
        Dianna.setAttribute("font-family", "Arial"); // Hauteur du rectangle
        Dianna.setAttribute("font-size", "12"); // Couleur de remplissage
        Dianna.setAttribute("fill", "white"); // Couleur de remplissage
        Dianna.textContent = `Done, ${(data2.totalDown * 10e-7).toFixed(2)} MB`;
        svg.appendChild(Dianna);
        svg.appendChild(rec);
        svg.appendChild(rect);
        Divpseud.appendChild(Name);
        auditratin.appendChild(ratiotexte);
        auditratin.appendChild(svg);
        auditratin.appendChild(total);
        document.body.appendChild(Divpseud);
        document.body.appendChild(auditratin);
        const alltransaction = data.data.transaction;
        var allskills = [];
        for (let i = 0; i < alltransaction.length; i++) {
          if (alltransaction[i].type.includes("skill_")) {
            alltransaction[i].type = alltransaction[i].type.replace("skill_", "Skill ");
            allskills.push(alltransaction[i]);
          }
        }
        let tabEach = [[]];
        allskills.forEach((element) => {
          let found = false; // Indicateur pour savoir si on a trouvé un tableau avec le même type
          // Vérifier chaque sous-tableau de tabEach
          tabEach.forEach((skill) => {
            // Si le type du premier élément du sous-tableau correspond au type de l'élément courant
            if (tabEach[0].length === 0) {
              tabEach[0].push(element);
              found = true;
            } else if (skill[0].type === element.type) {
              skill.push(element); // Ajouter l'élément à ce sous-tableau
              found = true; // Indiquer qu'on a trouvé le tableau correspondant
              return; // Sortir de la boucle pour cet élément
            }
          });
          // Si aucun tableau avec le même type n'a été trouvé
          if (!found) {
            let newTab = []; // Créer un nouveau tableau
            newTab.push(element); // Ajouter l'élément à ce nouveau tableau
            tabEach.push(newTab); // Ajouter ce nouveau tableau à tabEach
          }
        });
        let tabMax = [];
        for (let i = 0; i < tabEach.length; i++) {
          let max = getMaxValue(tabEach[i]);
          tabMax.push(max);
        }
        const ringsContainer = document.createElement("div");
        ringsContainer.id = "ringsContainer";
        tabMax.forEach((element) => {
          const svgRing = createCircularRingSVG(element.amount, element.type);
          const div = document.createElement("div");
          div.innerHTML = svgRing;
          ringsContainer.appendChild(div);
        });
        document.body.appendChild(ringsContainer);
      });
  }
  function getMaxValue(arr) {
    // Utiliser reduce pour trouver l'objet avec la valeur 'amount' maximale
    return arr.reduce((max, obj) => {
      return obj.amount > max.amount ? obj : max;
    });
  }
  function createCircularRingSVG(percentage, type, radius = 115, strokeWidth = 10) {
    // Limite le pourcentage entre 0 et 100
    percentage = Math.min(100, Math.max(0, percentage));
    // Dimensions du cercle
    const diameter = radius * 2;
    const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
    // Calcul de l'offset pour représenter le pourcentage
    const offset = circumference - (percentage / 100) * circumference;
    // Création du SVG avec les éléments cercle
    const svg = `
        <svg width="${diameter}" height="${diameter}" viewBox="0 0 ${diameter} ${diameter}">
            <!-- Cercle de fond -->
            <circle
                cx="${radius}" cy="${radius}" r="${radius - strokeWidth / 2}"
                fill="none"
                stroke="#e6e6e6"
                stroke-width="${strokeWidth}"
            />
            <!-- Cercle de progression -->
            <circle
                cx="${radius}" cy="${radius}" r="${radius - strokeWidth / 2}"
                fill="none"
                stroke="#4355ff"
                stroke-width="${strokeWidth}"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                stroke-linecap="round"
                transform="rotate(-90 ${radius} ${radius})"
            />
            <!-- Texte au centre -->
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="20px" fill="white">${type} ${percentage}%</text>
        </svg>
    `;
    return svg;
  }
  createlogin();
  